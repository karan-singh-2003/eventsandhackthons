import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserInfo } from "@/lib/auth-server";

export async function GET() {
  try {
    // Get logged-in user
    const user = await getUserInfo();

    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all notifications for logged-in user
    const notifications = await prisma.eventMemberNotification.findMany({
      where: {
        receiverId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },

      include: {
        event: {
          select: { name: true },
        },
        team: {
          select: { name: true },
        },
        sender: {
          select: { name: true, universityId: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        notifications,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Notifications Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
