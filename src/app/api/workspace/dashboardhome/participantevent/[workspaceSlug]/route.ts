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
          some: {
            userId: userInfo.userId,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Unauthorized - You are not a member of this workspace" },
        { status: 403 }
      );
    }

    // 3️⃣ FETCH EVENTS OF THIS WORKSPACE
 // 3️⃣ DEFINE CURRENT YEAR RANGE
const currentYearStart = new Date(new Date().getFullYear(), 0, 1);
const currentYearEnd = new Date(new Date().getFullYear(), 11, 31);

// 4️⃣ FETCH ONLY THIS YEAR'S EVENTS
const events = await prisma.event.findMany({
  where: {
    workspaceId: workspace.id,
    startDate: { gte: currentYearStart, lte: currentYearEnd }, // ⬅ this year only
  },
  select: {
    id: true,
    name: true,
  },
});

    // 4️⃣ FOR EACH EVENT → COUNT APPROVED ENROLLMENTS
    const result: any[] = [];

 for (const event of events) {
  // 1️⃣ Solo Enrollments
  const soloCount = await prisma.eventEnrollment.count({
    where: {
      eventId: event.id,
      

      status: "APPROVED",
     },
     
  });

  // 2️⃣ Get team for this event
  const team = await prisma.team.findFirst({
    where: {
      eventId: event.id,
    },
    select: {
      leaderId: true,
    },
  });

  // 3️⃣ Count ONLY team members (not leader)
  const teamMemberCount = await prisma.teamMember.count({
    where: {
      confirmed: true,
      isRemoved: false,
      userId: {
        not: team?.leaderId,  // ⬅️ Exclude leader
      },
      team: {
        eventId: event.id,
      },
    },
  });

  // 4️⃣ Total = solo (leader) + team members (not leader)
  const totalApproved = soloCount + teamMemberCount;

  result.push({
    name: event.name,
    ApprovedParticipants: totalApproved,
  });
}


result.sort((a, b) => b.ApprovedParticipants - a.ApprovedParticipants); // Sort descending by ApprovedParticipants

    // 5️⃣ RETURN CHART-FRIENDLY DATA
    return NextResponse.json(result);
  } catch (error) {
    console.error("Participants Per Event API Error:", error);
    return NextResponse.json(
      { error: "Failed to load chart data" },
      { status: 500 }
    );
  }
}
