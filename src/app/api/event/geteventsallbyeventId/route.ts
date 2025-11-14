import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/auth-server"

export async function GET(req: Request) {
  try {
   const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "eventId is required" },
        { status: 400 }
      )
    }

    // ✅ Step 0: Check if user is authenticated (optional)
    const user = await getUserInfo().catch(() => null)
    const userId = user?.userId ?? null

    // ✅ Step 1: Fetch the event to get its workspace
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        workspace: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      )
    }

    const workspaceId = event.workspaceId

    // ✅ Step 2: Fetch all events from this workspace
    const events = await prisma.event.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        bannerUrl: true,
        galleryUrls: true,
        location: true,
        startDate: true,
        endDate: true,
        category: true,
        tags: true,
        capacity: true,
        enrolledCount: true,
        interestedCount: true,
        viewCount: true,
        isOnline: true,
        eventLink: true,
        
        minTeamSize: true,
        maxTeamSize: true,
        visibility: true,
        approved: true,
        workspace: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    // ✅ Step 3: For each event, fetch userStatus if logged in
    const enrichedEvents = await Promise.all(
      events.map(async (ev) => {
        if (!userId) {
          return {
            ...ev,
            userStatus: {
              isAuthenticated: false,
              isInterested: false,
              isEnrolled: false,
            },
          }
        }

        const [interested, enrollment] = await Promise.all([
          prisma.eventInterest.findFirst({
            where: { userId, eventId: ev.id },
          }),

          prisma.eventEnrollment.findFirst({
            where: {
              eventId: ev.id,
              status:{not:'REJECTED'},
              OR: [
                { userId }, // solo
                { team: { members: { some: { userId } } } }, // team
              ],
            },
            include: {
              team: true,
            },
          }),
        ])

        return {
          ...ev,
          userStatus: {
            isAuthenticated: true,
            isInterested: !!interested,
            isEnrolled: !!enrollment,
            enrollmentType: enrollment?.team ? "Team" : enrollment ? "Solo" : null,
            team: enrollment?.team || null,
          },
        }
      })
    )

    return NextResponse.json(
      {
        success: true,
        message: "Workspace events fetched successfully",
        workspace: event.workspace,
        totalEvents: enrichedEvents.length,
        events: enrichedEvents,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Error fetching workspace events:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
