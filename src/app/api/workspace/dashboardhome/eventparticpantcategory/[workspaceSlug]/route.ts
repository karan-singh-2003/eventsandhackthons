import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthData } from "@/lib/auth-server";

export async function GET(
  req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params;

    // 1️⃣ AUTH CHECK
    const authData = await getAuthData();
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    const { userInfo } = authData;

    // 2️⃣ CHECK USER IS MEMBER OF WORKSPACE
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        members: {
          some: { userId: userInfo.userId },
        },
      },
      select: { id: true },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Unauthorized - You are not a member of this workspace" },
        { status: 403 }
      );
    }

    // -----------------------------------------------------------
    // PARTICIPANT CALCULATIONS
    // -----------------------------------------------------------
const currentYearStart = new Date(new Date().getFullYear(), 0, 1);
const currentYearEnd = new Date(new Date().getFullYear(), 11, 31);

    // 3️⃣ SOLO PARTICIPANTS (userId != null, teamId = null)
    const soloCount = await prisma.eventEnrollment.count({
      where: {
        status: "APPROVED",
        userId: { not: null },
        teamId: null,
        event: { workspaceId: workspace.id ,
          startDate: { gte: currentYearStart, lte: currentYearEnd },   
        },
      },
    });

    // 4️⃣ GET ALL TEAM LEADERS (so we can exclude them)
    const teams = await prisma.team.findMany({
      where: {
        workspaceId: workspace.id,
        event: {
      startDate: { gte: currentYearStart, lte: currentYearEnd }, // ⬅ THIS YEAR ONLY
    },
      },
      select: { leaderId: true },
    });

    const leaderIds = teams.map((t) => t.leaderId);

    // 5️⃣ TEAM MEMBERS (confirmed, not removed, exclude leaders)
    const teamMemberCount = await prisma.teamMember.count({
      where: {
        confirmed: true,
        isRemoved: false,
        userId: {
          notIn: leaderIds,
        },
        team: {
          workspaceId: workspace.id,
          event: {
        startDate: { gte: currentYearStart, lte: currentYearEnd }, // ⬅ THIS YEAR ONLY
      }, 
        },
      },
    });

    // 6️⃣ TEAM LEADERS also count as participants (1 per team)
    const teamLeaderCount = await prisma.eventEnrollment.count({
      where: {
        status: "APPROVED",
        teamId: { not: null },
        event: { workspaceId: workspace.id, 
           startDate: { gte: currentYearStart, lte: currentYearEnd }, //      
         },
      },
    });

    // FINAL TOTAL
    const totalParticipants = soloCount + teamLeaderCount + teamMemberCount;

    // -----------------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------------

    return NextResponse.json([
  { name: "SOLO", value: soloCount },
  { name: "TEAM", value: teamMemberCount + teamLeaderCount },
]);
;
  } catch (error) {
    console.error("Participant Summary API Error:", error);
    return NextResponse.json(
      { error: "Failed to load participant summary" },
      { status: 500 }
    );
  }
}
