import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json()

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      )
    }

    // Try getting the logged-in user info (optional)
      const user = await getUserInfo().catch(() => null)

    // Fetch event by ID with related workspace and roles
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

    // ✅ Count total interested users
    const totalInterestedCount = await prisma.eventInterest.count({
      where: { eventId: event.id },
    })

    // ✅ Base public event data (accessible to all)
    const responseData: any = {
      success: true,
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
        description: event.description,
        bannerUrl: event.bannerUrl,
        galleryUrls: event.galleryUrls,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        category: event.category,
        tags: event.tags,
        capacity: event.capacity,
        enrolledCount: event.enrolledCount,
        interestedCount: totalInterestedCount,
        viewCount: event.viewCount,
        workspace: {
          id: event.workspace.id,
          name: event.workspace.name,
          slug: event.workspace.slug,
        },
        isOnline: event.isOnline,
        eventLink: event.eventLink,
        linkTitle: event.linkTitle,
        linkUrl: event.linkUrl,
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        visibility: event.visibility,
        approved: event.approved,
      },
    }

    // ✅ Derive Event Type (Solo / Team / Both)
    responseData.event.eventType = event.eventType
     

    // ✅ Add authenticated user-specific info
    if (user?.userId) {

const fullUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      universityId: true,
      
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
    }
  })

  responseData.loggedInUser = fullUser



      const [interested, enrollment] = await Promise.all([
        prisma.eventInterest.findFirst({
          where: { eventId: event.id, userId: user.userId },
        }),
        prisma.eventEnrollment.findFirst({
          where: {
            eventId: event.id,
            OR: [
              { userId: user.userId },
              {
                team: {
                  members: { some: { userId: user.userId} },
                },
              },
            ],
            status:{not:'REJECTED'}
          },
          include: {
            team: {
              select: { id: true, name: true, code: true },
            },
          },
        }),
      ])

      responseData.userStatus = {
        isAuthenticated: true,
        isInterested: !!interested,
        isEnrolled: !!enrollment,
        enrollmentType: enrollment?.team
          ? "Team"
          : enrollment
          ? "Solo"
          : null,
        team: enrollment?.team || null,
      }
    } else {
      responseData.userStatus = {
        isAuthenticated: false,
        isInterested: false,
        isEnrolled: false,
      }
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error fetching event details:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching event details",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
