import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const { eventId, teamId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Missing eventId" },
        { status: 400 }
      );
    }

    const user = await getUserInfo();
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ------------------------------------------
    // 1️⃣ FETCH EVENT → CHECK REGISTRATION
    // ------------------------------------------
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { registrationEndDate: true },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const eventRegEnd:any = event.registrationEndDate;
    if (now > eventRegEnd) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration closed — Cannot cancel enrollment",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // 2️⃣ SOLO CANCELLATION (NO TEAMID)
    // ------------------------------------------
    if (!teamId) {
      const soloEnrollment = await prisma.eventEnrollment.findFirst({
        where: {
          eventId,
          userId: user.userId, // <--- SOLO CHECK FIXED
          teamId: null,
        },
      });

      if (!soloEnrollment) {
        return NextResponse.json(
          { success: false, message: "Solo enrollment not found" },
          { status: 404 }
        );
      }

      // If approved → no cancel
    //   if (soloEnrollment.status === "APPROVED") {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: "Your enrollment is approved — Cannot cancel",
    //       },
    //       { status: 400 }
    //     );
    //   }

      // Cancel SOLO enrollment
      await prisma.eventEnrollment.update({
        where: { id: soloEnrollment.id },
        data: { status: "REJECTED" },
      });

      return NextResponse.json(
        { success: true, message: "Solo enrollment cancelled successfully" },
        { status: 200 }
      );
    }

    // ------------------------------------------
    // 3️⃣ TEAM CANCELLATION (ONLY LEADER)
    // ------------------------------------------
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    if (team.leaderId !== user.userId) {
      return NextResponse.json(
        { success: false, message: "Only team leader can cancel team enrollment" },
        { status: 403 }
      );
    }

    const enrollment = await prisma.eventEnrollment.findFirst({
      where: { eventId, teamId },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Team enrollment not found" },
        { status: 404 }
      );
    }

    if (enrollment.status === "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "Team is approved — Cannot cancel",
        },
        { status: 400 }
      );
    }

    // Cancel TEAM + notify members
    await prisma.$transaction(async (tx) => {
      await tx.eventEnrollment.update({
        where: { id: enrollment.id },
        data: { status: "REJECTED" },
      });

      await tx.teamMember.updateMany({
        where: { teamId },
        data: { isRemoved: true, confirmed: false },
      });

      await Promise.all(
        team.members.map((m) =>
          tx.eventMemberNotification.create({
            data: {
              eventId,
              teamId,
              senderId: user.userId,
              receiverId: m.userId,
              status: "PENDING",
              message: `Your team enrollment has been cancelled by the team leader.`,
            },
          })
        )
      );
    });

    return NextResponse.json(
      { success: true, message: "Team enrollment cancelled successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Cancel Enrollment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
