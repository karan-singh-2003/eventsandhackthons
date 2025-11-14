import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthData } from "@/lib/auth-server"
import { z } from "zod"
import slugify from "slugify"
import { createNotification } from "@/actions/notifications"

// ✅ Zod validation schema
const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().optional(),

  startDate: z.string(),
  endDate: z.string(),

  registrationStartDate: z.string().optional(),
  registrationEndDate: z.string().optional(),

  isOnline: z.boolean().default(false),
  eventLink: z.string().url().optional(),
  bannerUrl: z.string().url().optional().nullable(),

  category: z.string().optional(),

  label: z.string().optional(),

  capacity: z.number().optional(),
  linkTitle: z.string().optional().or(z.literal("")),
linkUrl: z.string().url().optional().or(z.literal("")),

  // ✅ SOLO / TEAM / SOLO + TEAM
  eventType: z.enum(["SOLO", "TEAM", "SOLO_AND_TEAM"]).default("SOLO"),

  minTeamSize: z.number().optional(),
  maxTeamSize: z.number().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const body = await request.json()
    const parsed = createEventSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const data = parsed.data

    const { workspaceSlug } = params
    const auth = await getAuthData()

    if (!auth?.userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = auth.userInfo.userId

    // ✅ Workspace check
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // ✅ Membership check
    const member = await prisma.member.findFirst({
      where: { userId, workspaceId: workspace.id },
    })

    if (!member) {
      return NextResponse.json(
        { error: "You are not a member of this workspace" },
        { status: 403 }
      )
    }

    // ✅ Team event validation
    if (data.eventType !== "SOLO") {
      if (!data.minTeamSize || !data.maxTeamSize) {
        return NextResponse.json(
          { error: "Team size required for team events" },
          { status: 400 }
        )
      }

      if (data.minTeamSize > data.maxTeamSize) {
        return NextResponse.json(
          { error: "Min team size cannot be greater" },
          { status: 400 }
        )
      }
    }

    // ✅ Solo should not have team size
    if (data.eventType === "SOLO" && (data.minTeamSize || data.maxTeamSize)) {
      return NextResponse.json(
        { error: "Team size not allowed for SOLO event" },
        { status: 400 }
      )
    }

    // ✅ Unique slug
    let slug = slugify(data.name, { lower: true })
    const conflict = await prisma.event.findFirst({
      where: { slug, workspaceId: workspace.id },
    })
    if (conflict) slug = `${slug}-${Date.now()}`

    // ✅ Create Event (DRAFT)
    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),

        registrationStartDate: data.registrationStartDate
          ? new Date(data.registrationStartDate)
          : null,

        registrationEndDate: data.registrationEndDate
          ? new Date(data.registrationEndDate)
          : null,

        slug,
        workspaceId: workspace.id,
        createdById: userId,

        status: "DRAFT",
        visibility: "PUBLIC",
      },
    })

    // ✅ Add creator as event participant (no role)
   

    // ✅ Notification
    await createNotification({
      userId,
      message: `Event "${event.name}" created successfully`,
      workspaceId: workspace.id,
    })

    return NextResponse.json(
      { success: true, event },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Event Create Error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
