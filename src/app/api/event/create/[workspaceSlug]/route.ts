// app/api/event/create/[workspaceSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthData } from '@/lib/auth-server'
import { z } from 'zod'
import { createNotification } from '@/actions/notifications'
import redis from '@/lib/redis'

// ✅ Zod schema (client only sends name + isOnline)
const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  isOnline: z.boolean().default(false),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceSlug: any } }
) {
  try {
    const body = await request.json()
    const result = createEventSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { workspaceSlug } = params
    const { name, isOnline } = result.data

    // ✅ Auth check
    const authData = await getAuthData()
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      )
    }

    const { userInfo, sessionInfo } = authData
    if (new Date() > new Date(sessionInfo.expiresAt)) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // ✅ Find workspace by slug
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    // ✅ Check membership
    const isMember = await prisma.member.findFirst({
      where: { userId: userInfo.userId, workspaceId: workspace.id },
    })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Forbidden - You are not a member of this workspace' },
        { status: 403 }
      )
    }

    // ✅ Redis cache check (event name uniqueness per workspace)
    const cacheKey = `event:${workspace.id}:name:${name.toLowerCase()}`
    const cachedEvent = await prisma.event.findFirst({
        where: { workspaceId: workspace.id,  name },
        })

    if (cachedEvent) {
      return NextResponse.json(
        { message: 'Event name already exists (cached)' },
        { status: 409 }
      )
    }

    // ✅ Double-check in DB
    const existingEvent = await prisma.event.findFirst({
      where: { workspaceId: workspace.id,  name },
    })

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Event name already exists' },
        { status: 409 }
      )
    }


    // ✅ Create event
    const newEvent = await prisma.event.create({
      data: {
        name: name,
        
        isOnline: isOnline ?? false,
        startDate: new Date(), // placeholder
        endDate: new Date(),   // placeholder
        workspaceId: workspace.id,
        createdById: userInfo.userId,
   
      },
    })


    // ✅ Cache event name in Redis (to prevent race conditions)
    await redis.set(cacheKey, newEvent.id)
    await redis.expire(cacheKey, 60 * 5) // cache for 5 minutes

    
    // ✅ Create default event role (Organizer)
    const organizerRole=  await prisma.eventRole.create({
      data: {
        name: 'ORGANIZER',
        workspaceId: workspace.id,
        eventId: newEvent.id,
      },
    })

      const eventPermissions = await prisma.permission.findMany({
      where: {
        category: {
          name: "EVENT", // ✅ only fetch Event category permissions
        },
      },
      select: { id: true },
    });

     if (eventPermissions.length > 0) {
      await prisma.eventRolePermission.createMany({
        data: eventPermissions.map((permission: { id: string }) => ({
          roleId: organizerRole.id,
          permissionId: permission.id,
        })),
      })};

    // ✅ Create participant entry (creator = organizer)
    await prisma.eventParticipant.create({
      data: {
        userId: userInfo.userId,
        eventId: newEvent.id,
        workspaceId: workspace.id,
        roleId: organizerRole.id,
        joinedAt: new Date(),
        status: 'APPROVED',
      },
    })

    // ✅ Notification
    await createNotification({
      userId: userInfo.userId,
      message: `Event "${newEvent.name}" created successfully 🎉`,
      workspaceId: workspace.id,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        event: {
          id: newEvent.id,
          name: newEvent.name,
        },
      },
      { status: 201 }
    )
  } catch (error:any) {
    if (error.code === "P2002") {
    return NextResponse.json(
      { message: "Event with this name already exists in this workspace" },
      { status: 409 }
    )
  }
  throw error; // re-throw if not handled}
}}
