import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthData } from "@/lib/auth-server"
import { z } from "zod"
import { createNotification } from "@/actions/notifications"
import slugify from "slugify"

// ✅ Zod validation schema for Event creation

const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isOnline: z.boolean().default(false),
  eventLink: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  capacity: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  isTeamEvent: z.boolean().default(false),
  minTeamSize: z.number().int().positive().optional(),
  maxTeamSize: z.number().int().positive().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const body = await request.json()
    const result = createEventSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: result.error.issues },
        { status: 400 }
      )
    }

    const {
      name,
      description,
      location,
      startDate,
      endDate,
      isOnline,
      eventLink,
      bannerUrl,
      capacity,
      tags,
      isTeamEvent,
      minTeamSize,
      maxTeamSize,
    } = result.data

    const { workspaceSlug } = params

    // ✅ Auth check
    const authData = await getAuthData()
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session found" },
        { status: 401 }
      )
    }

    const { userInfo, sessionInfo } = authData
    if (new Date() > new Date(sessionInfo.expiresAt)) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    // ✅ Find workspace
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // ✅ Verify membership
    const isMember = await prisma.member.findFirst({
      where: { userId: userInfo.userId, workspaceId: workspace.id },
    })

    if (!isMember) {
      return NextResponse.json(
        { error: "Forbidden - You are not a member of this workspace" },
        { status: 403 }
      )
    }

    // ✅ Generate slug
    const slug = slugify(name, { lower: true, strict: true })

    // ✅ Check uniqueness (per workspace)
  const existingEvent = await prisma.event.findFirst({
  where: {
    workspaceId: workspace.id,
    AND: {
      OR: [
        { name },
        {  slug },
      ],
    },
  },
})


    if (existingEvent) {
      return NextResponse.json(
        { error: "Event with this name or slug already exists" },
        { status: 409 }
      )
    }

    // ✅ Create event
    const newEvent = await prisma.event.create({
      data: {
        name,
        slug,
        description,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isOnline,
        eventLink,
        bannerUrl,
        capacity,
        tags,
        isTeamEvent,
        minTeamSize,
        maxTeamSize,
        workspaceId: workspace.id,
        createdById: userInfo.userId,
      },
    })

    // ✅ Create default Organizer role
    const organizerRole = await prisma.eventRole.create({
      data: {
        name: "ORGANIZER",
        workspaceId: workspace.id,
        eventId: newEvent.id,
      },
    })

    // ✅ Assign all EVENT category permissions to Organizer
    const eventPermissions = await prisma.permission.findMany({
      where: { category: { name: "EVENT" } },
      select: { id: true },
    })

    if (eventPermissions.length > 0) {
      await prisma.eventRolePermission.createMany({
        data: eventPermissions.map((p) => ({
          roleId: organizerRole.id,
          permissionId: p.id,
        })),
      })
    }

    // ✅ Add creator as participant (Organizer)
    await prisma.eventParticipant.create({
      data: {
        userId: userInfo.userId,
        eventId: newEvent.id,
        workspaceId: workspace.id,
        roleId: organizerRole.id,
        joinedAt: new Date(),
        status: "APPROVED",
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
        message: "Event created successfully",
        event: newEvent,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("❌ Error creating event:", error)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Event name or slug already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
