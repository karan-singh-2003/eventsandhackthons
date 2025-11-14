import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },   // latest first
      take: 4,                           // only 4 events
      include: {
        workspace: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        events,
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
