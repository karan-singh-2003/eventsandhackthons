import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

export async function GET() {
  try {
    // 🔐 Check logged-in user
    const user = await getUserInfo().catch(() => null);
    const userId = user?.userId ?? null;

    // 1️⃣ Get latest events
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        workspace: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // 2️⃣ If no user logged in → return basic events
    if (!userId) {
      return NextResponse.json(
        { success: true, events },
        { status: 200 }
      );
    }

    // 3️⃣ If user is logged in → enrich each event with userStatus
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const enrollment = await prisma.eventEnrollment.findFirst({
          where: {
            eventId: event.id,
            status: { not: "REJECTED" }, // ❗ ignore rejected enrollments
            OR: [
              { userId }, // solo enrollment
              { team: { members: { some: { userId } } } }, // team enrollment
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

    return NextResponse.json(
      {
        success: true,
        events: enrichedEvents,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error fetching latest events:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
