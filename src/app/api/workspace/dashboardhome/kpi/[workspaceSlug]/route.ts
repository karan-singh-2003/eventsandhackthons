import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthData } from "@/lib/auth-server";


export async function GET(
  req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params;

    // 🔐 AUTH CHECK
    const authData = await getAuthData();
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    const { userInfo } = authData;

    // 🔎 VERIFY WORKSPACE EXISTS AND USER IS A MEMBER
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        members: {
          some: {
            userId: userInfo.userId,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Unauthorized - Not a member of this workspace" },
        { status: 403 }
      );
    }

    // -------------------------
    //     KPI CALCULATIONS
    // -------------------------

    const totalEvents = await prisma.event.count({
      where: {
        workspaceId: workspace.id,
      },
    });

    const activeEvents = await prisma.event.count({
      where: {
        workspaceId: workspace.id,
        startDate: { gte: new Date() },
      },
    });

  // 1️⃣ Count SOLO participants
const soloCount = await prisma.eventEnrollment.count({
  where: {
    status: "APPROVED",
    userId: { not: null },  // solo
    teamId: null,
    event: { workspaceId: workspace.id },
  },
});

// 2️⃣ Count TEAM leaders (stored in EventEnrollment)
const teamLeaderCount = await prisma.eventEnrollment.count({
  where: {
    status: "APPROVED",
    teamId: { not: null }, // team enroll row = leader
    event: { workspaceId: workspace.id },
  },
});

// 3️⃣ Get ALL team leaders IDs (exclude from members)
const teams = await prisma.team.findMany({
  where: {
    event: { workspaceId: workspace.id },
  },
  select: { leaderId: true },
});

const leaderIds = teams.map(t => t.leaderId);

// 4️⃣ Count TEAM MEMBERS (exclude leaders)
const teamMemberCount = await prisma.teamMember.count({
  where: {
    confirmed: true,
    isRemoved: false,
    userId: {
      notIn: leaderIds,   // exclude leaders
    },
    team: {
      event: { workspaceId: workspace.id },
    },
  },
});

// 5️⃣ FINAL TOTAL
const totalParticipants = soloCount + teamLeaderCount + teamMemberCount;


    const pendingApprovals = await prisma.eventEnrollment.count({
      where: {
        workspaceId: workspace.id,
        status: "PENDING",
      },
    });

    const kpiData = [
      {
        label: "Total Events",
        value: totalEvents,
        change: 12,
        icon: "📊",
      },
      {
        label: "Active / Upcoming",
        value: activeEvents,
        change: 5,
        icon: "🎯",
      },
      {
        label: "Total Participants",
        value: totalParticipants,
        change: 23,
        icon: "👥",
      },
      {
        label: "Pending participant",
        value: pendingApprovals,
        change: -2,
        icon: "⏳",
      },
    ];

    return NextResponse.json(kpiData);
  } catch (error) {
    console.error("KPI Workspace Error:", error);
    return NextResponse.json(
      { error: "Failed to load KPI data" },
      { status: 500 }
    );
  }
}
