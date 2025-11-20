// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getUserInfo } from "@/lib/auth-server";

// type Body = {
//   notificationId: string;
//   action: "ACCEPT" | "REJECT";
// };

// export async function POST(req: Request) {
//   try {
//     const body: Body = await req.json();
//     const { notificationId, action } = body;

//     if (!notificationId || !["ACCEPT", "REJECT"].includes(action)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid request body" },
//         { status: 400 }
//       );
//     }

//     // --- auth ---
//     const user = await getUserInfo();
//     if (!user?.userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     // --- fetch notification ---
//     const notification = await prisma.eventMemberNotification.findUnique({
//       where: { id: notificationId },
//       include: {
//         team: true,
//         event: true,
//       },
//     });

//     if (!notification) {
//       return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
//     }

//     if (notification.receiverId !== user.userId) {
//       return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
//     }

//     if (notification.status !== "INVITESENT") {
//       return NextResponse.json(
//         { success: false, message: "Notification already responded" },
//         { status: 400 }
//       );
//     }

//     const teamId = notification.teamId;
//     const eventId = notification.eventId;

//     if (!teamId || !eventId) {
//       return NextResponse.json(
//         { success: false, message: "Invalid notification metadata" },
//         { status: 400 }
//       );
//     }

//     const enrollment = await prisma.eventEnrollment.findFirst({
//       where: { teamId, eventId },
//     });

//     // =====================================================
//     // =============== ACCEPT FLOW ==========================
//     // =====================================================
//     if (action === "ACCEPT") {
//       const tx = await prisma.$transaction(async (tx) => {
//         await tx.eventMemberNotification.update({
//           where: { id: notificationId },
//           data: { status: "ACCEPTED" },
//         });

//         await tx.teamMember.updateMany({
//           where: { teamId, userId: user.userId },
//           data: { confirmed: true, isRemoved: false },
//         });

//         const members = await tx.teamMember.findMany({
//           where: { teamId, isRemoved: false },
//           select: { confirmed: true },
//         });

//         const allConfirmed = members.every(m => m.confirmed);

//         if (allConfirmed && enrollment?.status === "PENDING") {
//           await tx.eventEnrollment.update({
//             where: { id: enrollment.id },
//             data: { status: "APPROVED" },
//           });

//           await tx.eventMemberNotification.create({
//             data: {
//               eventId,
//               teamId,
//               senderId: user.userId,
//               receiverId: notification.senderId,
//               status: "PENDING",
//               message: `All members have accepted. Your team "${notification.team?.name}" is approved.`,
//             },
//           });
//         }

//         return { allConfirmed };
//       });

//       return NextResponse.json(
//         { success: true, message: "Invitation accepted", allConfirmed: tx?.allConfirmed },
//         { status: 200 }
//       );
//     }

//     // =====================================================
//     // =============== REJECT FLOW =========================
//     // =====================================================

//     const tx = await prisma.$transaction(async (tx) => {
//       // ❌ Reject current member's invite
//       await tx.eventMemberNotification.update({
//         where: { id: notificationId },
//         data: { status: "REJECTED", respondedAt: new Date() },
//       });

//       // ❌ Reject entire enrollment
//       if (enrollment?.status === "PENDING") {
//         await tx.eventEnrollment.update({
//           where: { id: enrollment.id },
//           data: { status: "REJECTED" },
//         });
//       }

//       // ❌ Remove ALL members from team (including leader)
//       await tx.teamMember.updateMany({
//         where: { teamId },
//         data: { isRemoved: true, confirmed: false },
//       });

//       // ❌ Cancel all pending invites for other members
//       await tx.eventMemberNotification.updateMany({
//         where: {
//           teamId,
//           status: "INVITESENT",
//           id: { not: notificationId },
//         },
//         data: { status: "REJECTED" },
//       });

//       // ❌ Inform the leader
//       await tx.eventMemberNotification.create({
//         data: {
//           eventId,
//           teamId,
//           senderId: user.userId,
//           receiverId: notification.senderId, // leader
//           status: "PENDING",
//           message: `${user.name} rejected the team invitation. Your entire team "${notification.team?.name}" has been disqualified.`,
//         },
//       });

//       return {};
//     });

//     return NextResponse.json(
//       { success: true, message: "Invitation rejected. Entire team has been removed." },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error("❌ /api/team/confirm error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

type Body = {
  notificationId: string;
  action: "ACCEPT" | "REJECT";
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { notificationId, action } = body;

    if (!notificationId || !["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // --- auth ---
    const user = await getUserInfo();
    if (!user?.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // --- fetch notification ---
    const notification = await prisma.eventMemberNotification.findUnique({
      where: { id: notificationId },
      include: {
        team: true,
        event: true,
      },
    });

    if (!notification) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    if (notification.receiverId !== user.userId) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (notification.status !== "INVITESENT") {
      return NextResponse.json(
        { success: false, message: "Notification already responded" },
        { status: 400 }
      );
    }

    
    const teamId = notification.teamId;
    const eventId = notification.eventId;

    if (!teamId || !eventId) {
      return NextResponse.json(
        { success: false, message: "Invalid notification metadata" },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // 🔥 NEW LOGIC ADDED — CHECK REGISTRATION DEADLINE
    // -------------------------------------------------------
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
    const regEnd:any = event.registrationEndDate;

    if (now > regEnd) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration period is over — You cannot accept or reject now.",
        },
        { status: 400 }
      );
    }
    // -------------------------------------------------------
    // END OF NEW LOGIC
    // -------------------------------------------------------

    const enrollment = await prisma.eventEnrollment.findFirst({
      where: { teamId, eventId },
    });

    // =====================================================
    // =============== ACCEPT FLOW ==========================
    // =====================================================
    if (action === "ACCEPT") {
      const tx = await prisma.$transaction(async (tx) => {
        await tx.eventMemberNotification.update({
          where: { id: notificationId },
          data: { status: "ACCEPTED" },
        });

        await tx.teamMember.updateMany({
          where: { teamId, userId: user.userId },
          data: { confirmed: true, isRemoved: false },
        });

        const members = await tx.teamMember.findMany({
          where: { teamId, isRemoved: false },
          select: { confirmed: true },
        });

        const allConfirmed = members.every(m => m.confirmed);

        if (allConfirmed && enrollment?.status === "PENDING") {
          await tx.eventEnrollment.update({
            where: { id: enrollment.id },
            data: { status: "APPROVED" },
          });

          await tx.eventMemberNotification.create({
            data: {
              eventId,
              teamId,
              senderId: user.userId,
              receiverId: notification.senderId,
              status: "PENDING",
              message: `All members have accepted. Your team "${notification.team?.name}" is approved.`,
            },
          });
        }

        return { allConfirmed };
      });

      return NextResponse.json(
        { success: true, message: "Invitation accepted", allConfirmed: tx?.allConfirmed },
        { status: 200 }
      );
    }

    // =====================================================
    // =============== REJECT FLOW =========================
    // =====================================================

    const tx = await prisma.$transaction(async (tx) => {
      // ❌ Reject current member's invite
      await tx.eventMemberNotification.update({
        where: { id: notificationId },
        data: { status: "REJECTED", respondedAt: new Date() },
      });

      // ❌ Reject entire enrollment
      if (enrollment?.status === "PENDING") {
        await tx.eventEnrollment.update({
          where: { id: enrollment.id },
          data: { status: "REJECTED" },
        });
      }

      // ❌ Remove ALL members from team (including leader)
      await tx.teamMember.updateMany({
        where: { teamId },
        data: { isRemoved: true, confirmed: false },
      });

      // ❌ Cancel all pending invites for other members
      await tx.eventMemberNotification.updateMany({
        where: {
          teamId,
          status: "INVITESENT",
          id: { not: notificationId },
        },
        data: { status: "REJECTED" },
      });

      // ❌ Inform the leader
      await tx.eventMemberNotification.create({
        data: {
          eventId,
          teamId,
          senderId: user.userId,
          receiverId: notification.senderId, // leader
          status: "PENDING",
          message: `${user.name} rejected the team invitation. Your entire team "${notification.team?.name}" has been disqualified.`,
        },
      });

      return {};
    });

    return NextResponse.json(
      { success: true, message: "Invitation rejected. Entire team has been removed." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ /api/team/confirm error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
