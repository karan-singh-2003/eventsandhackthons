import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      eventId,
      teamName,
      leaderUniversityId,
      memberUniversityIds, // array: ["U1", "U2", ...]
    } = body

    // --------------------------------------------------------
    // 🔐 Step 1: Auth Check
    // --------------------------------------------------------
    const user = await getUserInfo()
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // --------------------------------------------------------
    // 🔎 Step 2: Fetch Event + Min/Max Team Size
    // --------------------------------------------------------
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      )
    }
    if(!teamName || teamName.trim().length===0){
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      )
    }

   const existingTeamname =  await prisma.teamMember.findFirst({
      where: {
        team: {
          name: teamName,
          eventId: eventId,
        },
        
        
      },
    })
    if (existingTeamname) {
      return NextResponse.json(
        { success: false, message: "Team name already exist" },
        { status: 400 }
      )
    }


    if (event.eventType === "SOLO") {
      return NextResponse.json(
        { success: false, message: "Solo event cannot have team registration" },
        { status: 400 }
      )
    }

    const now = new Date()

    if (event.registrationStartDate && event.registrationEndDate) {
      if (now < event.registrationStartDate || now > event.registrationEndDate) {
        return NextResponse.json(
          { success: false, message: "Registration period is closed" },
          { status: 403 }
        )
      }
    }

    const minSize = event.minTeamSize ?? 2
    const maxSize = event.maxTeamSize ?? 10

    const teamSize = 1 + memberUniversityIds.length
    if (teamSize < minSize || teamSize > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `Team size must be between ${minSize} and ${maxSize}`,
        },
        { status: 400 }
      )
    }

    // --------------------------------------------------------
    // 🧍 Step 3: Identify team leader from UniversityId
    // --------------------------------------------------------
    const leader = await prisma.user.findUnique({
      where: { universityId: leaderUniversityId },
    })

    if (!leader) {
      return NextResponse.json(
        { success: false, message: "Leader not found" },
        { status: 404 }
      )
    }

    // Leader cannot be enrolled already
    const leaderEnrollment = await prisma.eventEnrollment.findFirst({
      where: {
        eventId,
         status: {
      in: ["PENDING", "APPROVED"], // block only active enrollments
    },
        OR: [
          { userId: leader.id },
          { team: { members: { some: { userId: leader.id } } } },
        ],
      },
    })

    if (leaderEnrollment) {
      return NextResponse.json(
        { success: false, message: "Leader is already enrolled in this event" },
        { status: 400 }
      )
    }

    // --------------------------------------------------------
    // 👥 Step 4: Fetch & Validate Team Members
    // --------------------------------------------------------
    const members = await prisma.user.findMany({
      where: {
        universityId: { in: memberUniversityIds },
      },
    })

    if (members.length !== memberUniversityIds.length) {
      return NextResponse.json(
        { success: false, message: "Some team members not found" },
        { status: 400 }
      )
    }

    // ❗ Check if any member is already enrolled
    const alreadyEnrolledMembers = []

    for (const m of members) {
      const enrollment = await prisma.eventEnrollment.findFirst({
        where: {
          eventId,
          status: {
      in: ["PENDING", "APPROVED"], // block only active enrollments
    },
          OR: [
            { userId: m.id },
            { team: { members: { some: { userId: m.id } } } },
          ],
        },
      })

      if (enrollment) alreadyEnrolledMembers.push(m.universityId)
    }

    if (alreadyEnrolledMembers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `These members are already enrolled: ${alreadyEnrolledMembers.join(
            ", "
          )}`,
        },
        { status: 400 }
      )
    }
     const memberIds = members.map((m) => m.id);

     

    // --------------------------------------------------------
    // 🆕 Step 5: Create Team
    // --------------------------------------------------------
    const team = await prisma.team.create({
      data: {
        name: teamName,
        leaderId: leader.id,
        eventId,
        workspaceId: event.workspaceId,
        code: `${eventId}-${Date.now()}`,
      },
    })

    // --------------------------------------------------------
    // ➕ Step 6: Add Team Members
    // --------------------------------------------------------
    await prisma.teamMember.createMany({
      data: [
        // leader
        { teamId: team.id, userId: leader.id ,confirmed: true},
        // members
        ...members.map((m) => ({
          teamId: team.id,
          userId: m.id,
        })),
      ],
    })

    // --------------------------------------------------------
    // 📌 Step 7: Create Enrollment (PENDING)
    // --------------------------------------------------------
    const enrollment = await prisma.eventEnrollment.create({
      data: {
        eventId,
        teamId: team.id,
        workspaceId: event.workspaceId,
        status: "PENDING",
      },
    })

 

await prisma.eventMemberNotification.createMany({
      data: memberIds.map((receiverId) => ({
        eventId,
        teamId: team.id,
        senderId: user.userId,
        receiverId,
        status: "INVITESENT",
       message: `You have been added to team "${teamName}" for the event "${event.name}" by ${leader.name}. Please accept or reject the invitation.`,
})),
    });
    return NextResponse.json(
      {
        success: true,
        message: "Team registration submitted. Waiting for member approvals.",
        team,
        enrollment,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("❌ Team Enrollment Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}
