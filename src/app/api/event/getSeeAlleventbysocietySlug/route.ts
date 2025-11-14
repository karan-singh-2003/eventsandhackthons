import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/auth-server"

export async function GET(req: Request) {
  try {
    // ✅ 1. Extract `societySlug` from URL
    const { searchParams } = new URL(req.url)
    const societySlug = searchParams.get("societySlug")

    if (!societySlug || typeof societySlug !== "string") {
      return NextResponse.json(
        { success: false, message: "societySlug is required in query params" },
        { status: 400 }
      )
    }

    // ✅ 2. Get logged-in user (optional)
    const user = await getUserInfo().catch(() => null)
    const userId = user?.userId ?? null

    // ✅ 3. Fetch workspace with all events
    const workspace = await prisma.workspace.findUnique({
      where: { slug: societySlug },
      include: {
        events: {
          include: {
            workspace: { select: { id: true, name: true, slug: true } },
          
            enrollments: {
              include: {
                user: { select: { id: true, name: true, email: true } },
                team: {
                  include: {
                    members: {
                      include: {
                        user: { select: { id: true, name: true, email: true } },
                      },
                    },
                  },
                },
              },
            },
            interestedUsers: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
            teams: {
              include: {
                leader: { select: { id: true, name: true, email: true } },
                members: {
                  include: {
                    user: { select: { id: true, name: true, email: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { success: false, message: `No society found with name "${societySlug}"` },
        { status: 404 }
      )
    }

    // ✅ 4. Separate future/upcoming vs past events
    const today = new Date()

    const upcomingEvents = workspace.events
      .filter((event) => new Date(event.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    const pastEvents = workspace.events
      .filter((event) => new Date(event.startDate) < today)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

    // ✅ 5. Combine: Upcoming first, then Past
    const sortedEvents = [...upcomingEvents, ...pastEvents]

    // ✅ 6. Attach user status
    const eventsWithUserStatus = await Promise.all(
      sortedEvents.map(async (ev) => {
        if (!userId) {
          return {
            ...ev,
            userStatus: {
              isAuthenticated: false,
              isInterested: false,
              isEnrolled: false,
              enrollmentType: null,
              team: null,
            },
            interestedCount: ev.interestedUsers.length,
          }
        }

        const [interested, enrollment] = await Promise.all([
          prisma.eventInterest.findFirst({
            where: { userId, eventId: ev.id },
          }),
          prisma.eventEnrollment.findFirst({
            where: {
              eventId: ev.id,
              OR: [
                { userId },
                { team: { members: { some: { userId } } } },
              ],
              status:{not:'REJECTED'}
            },
            include: { team: true },
          }),
        ])

        return {
          ...ev,
          interestedCount: ev.interestedUsers.length,
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

    // ✅ 7. Return final response
    return NextResponse.json(
      {
        success: true,
        message: `Fetched all events for ${societySlug}`,
        society: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        totalEvents: eventsWithUserStatus.length,
        events: eventsWithUserStatus,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Error fetching society events:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching events",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
