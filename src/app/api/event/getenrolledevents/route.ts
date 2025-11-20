import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

/**
 * @route   GET /api/user/events
 * @desc    Get all events the logged-in user is enrolled in (excluding REJECTED)
 * @access  Private
 */
export async function GET() {
  try {
    // 1️⃣ Get logged-in user
    const user = await getUserInfo().catch(() => null);

    if (!user || !user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized — User not logged in",
        },
        { status: 401 }
      );
    }

    const userId = user.userId;

    // 2️⃣ Fetch enrollments (exclude REJECTED)
    const enrollments = await prisma.eventEnrollment.findMany({
      where: {
        status: { not: "REJECTED" },
        OR: [
          { userId }, // SOLO
          { team: { members: { some: { userId } } } }, // TEAM MEMBER
        ],
      },
      include: {
        event: {
          include: {
            workspace: true,
          },
        },

        // ⭐ IMPORTANT — include full TEAM data with USERS
        team: {
            
          include: {
            members: {
              include: {
                user: true // gives name, email, id, etc.
              },
            },
          },
        },
      },

      orderBy: {
        registeredAt: "desc",
      },
    });

    // 3️⃣ Create the output response
   const userEvents = enrollments.map((enrollment) => ({
  ...enrollment.event,
  userStatus: {
    isEnrolled: true,
    enrollmentType: enrollment.team ? "TEAM" : "SOLO",
    soloUser: enrollment.userId
      ? {
          id: enrollment.userId,
          name: user.name,          // ADD THIS
          email: user.email,        // ADD THIS
          universityId: user.universityId,
        }
      : null,

    team: enrollment.team
      ? {
          ...enrollment.team,
          members: enrollment.team.members.map((m) => ({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            universityId: m.user.universityId,
          })),
        }
      : null,
  },
}));

    return NextResponse.json(
      {
        success: true,
        totalEvents: userEvents.length,
        events: userEvents,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching enrolled events:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enrolled events.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
