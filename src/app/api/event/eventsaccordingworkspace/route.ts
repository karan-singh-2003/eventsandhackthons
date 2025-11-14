import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @route   GET /api/public/events
 * @desc    Fetch all workspaces and their public events (upcoming first, past last)
 * @access  Public
 */
export async function GET() {
  try {
    // ✅ 1️⃣ Fetch workspaces and their public events
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
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // ✅ 2️⃣ Sort events inside each workspace
    const today = new Date();

    const sortedWorkspaces = workspaces.map((workspace) => {
      const upcoming = workspace.events
        .filter((event) => new Date(event.startDate) >= today)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); // soonest first

      const past = workspace.events
        .filter((event) => new Date(event.startDate) < today)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // latest past first

      return {
        ...workspace,
        events: [...upcoming, ...past], // ✅ upcoming first, past last
      };
    });

    // ✅ 3️⃣ Return formatted response
    return NextResponse.json(
      {
        success: true,
        totalWorkspaces: sortedWorkspaces.length,
        data: sortedWorkspaces,
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
