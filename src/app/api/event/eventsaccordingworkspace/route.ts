import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

/**
 * @route   GET /api/public/events
 * @desc    Fetch all workspaces and events, and add user enrollment info
 * @access  Public
 */
export async function GET() {
  try {
    // 🔐 1️⃣ Get User (optional)
    const user = await getUserInfo().catch(() => null);
    const userId = user?.userId ?? null;

    // 2️⃣ Fetch All Workspaces & Public Events
    const workspaces = await prisma.workspace.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        events: {
          where: {
            visibility: "PUBLIC",
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            bannerUrl: true,
            category: true,
            startDate: true,
            endDate: true,
            tags: true,
            location: true,
            isOnline: true,
            eventLink: true,
            enrolledCount: true,
            capacity: true,
            // later we attach userStatus manually
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const today = new Date();

    // 3️⃣ Attach user enrollment info to each event
    const finalWorkspaces = await Promise.all(
      workspaces.map(async (workspace) => {
        // Sort upcoming + past
        const upcoming = workspace.events
          .filter((e) => new Date(e.startDate) >= today)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        const past = workspace.events
          .filter((e) => new Date(e.startDate) < today)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        const sortedEvents = [...upcoming, ...past];

        // If user is NOT logged in, return events without user status
        if (!userId) {
          return { ...workspace, events: sortedEvents };
        }

        // 4️⃣ For logged-in user → attach userStatus
        const enrichedEvents = await Promise.all(
          sortedEvents.map(async (event) => {
            const enrollment = await prisma.eventEnrollment.findFirst({
              where: {
                eventId: event.id,
                status: { not: "REJECTED" },  // ❗ exclude rejected enrollments
                OR: [
                  { userId }, // solo
                  { team: { members: { some: { userId } } } }, // team member
                ],
              },
              include: {
                team: true,
              },
            });

            return {
              ...event,
              userStatus: {
                isAuthenticated: true,
                isEnrolled: !!enrollment,
                enrollmentType: enrollment?.team ? "TEAM" : enrollment ? "SOLO" : null,
                team: enrollment?.team || null,
              },
            };
          })
        );

        return {
          ...workspace,
          events: enrichedEvents,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        totalWorkspaces: finalWorkspaces.length,
        data: finalWorkspaces,
        loggedInUser: userId || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workspace and event data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
