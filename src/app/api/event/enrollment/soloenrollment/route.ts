import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json()

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      )
    }

    // ---------------------------
    // 1️⃣ AUTHENTICATION CHECK
    // ---------------------------
    const user = await getUserInfo().catch(() => null)

    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "Login required to enroll" },
        { status: 401 }
      )
    }
    const userId = user.userId

    // ---------------------------
    // 2️⃣ FETCH EVENT
    // ---------------------------
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      )
    }

    // ---------------------------
    // 3️⃣ CHECK EVENT TYPE
    // ---------------------------
    if (event.eventType !== "SOLO" && event.eventType !== "SOLO_AND_TEAM") {
      return NextResponse.json(
        { success: false, message: "Solo registration not allowed for this event" },
        { status: 400 }
      )
    }

    // ---------------------------
    // 4️⃣ CHECK IF EVENT IS OPEN
    // ---------------------------
    const now = new Date()

    if (event.registrationStartDate && event.registrationEndDate) {
      if (now < event.registrationStartDate || now > event.registrationEndDate) {
        return NextResponse.json(
          { success: false, message: "Registration period is closed" },
          { status: 403 }
        )
      }
    }

    // ---------------------------
    // 5️⃣ CHECK IF USER ALREADY ENROLLED SOLO
    // ---------------------------
  // ---------------------------
// 5️⃣ CHECK IF USER ALREADY ENROLLED (IGNORE REJECTED)
// ---------------------------
const existingEnrollment = await prisma.eventEnrollment.findFirst({
  where: {
    eventId,
    status: { not: "REJECTED" }, // <--- IMPORTANT FIX
    OR: [
      { userId }, // solo enrollment
      {
        team: {
          members: {
            some: { userId } // team enrollment
          }
        }
      }
    ]
  }
})

if (existingEnrollment) {
  return NextResponse.json(
    {
      success: false,
      message: "You are already enrolled in this event"
    },
    { status: 409 }
  )
}


    // ---------------------------
    // 6️⃣ CHECK EVENT CAPACITY
    // ---------------------------
   

    // ---------------------------
    // 7️⃣ CREATE SOLO ENROLLMENT
    // ---------------------------
    const enrollment = await prisma.eventEnrollment.create({
      data: {
        eventId,
        userId,
        workspaceId: event.workspaceId,
        status: "APPROVED", // SOLO is auto-approved
      }
    })

    // ---------------------------
    // 8️⃣ UPDATE ENROLLED COUNT
    // ---------------------------
    await prisma.event.update({
      where: { id: eventId },
      data: {
        enrolledCount: { increment: 1 },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Solo enrollment successful",
        enrollment,
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("❌ Solo Enrollment Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during enrollment",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
