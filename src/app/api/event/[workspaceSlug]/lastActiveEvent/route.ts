import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthData } from "@/lib/auth-server";

export async function GET(
  req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params;

    // ✅ Get authenticated user
    const authData = await getAuthData();
    if (!authData.userInfo || !authData.sessionInfo) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    const { userInfo, sessionInfo } = authData;
    const userId = userInfo.userId;

    if (new Date() > new Date(sessionInfo.expiresAt)) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // ✅ Get workspace ID from slug
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    const workspaceId = workspace.id;

    // ✅ Ensure user is member of workspace
    const workspaceMember = await prisma.member.findFirst({
      where: { userId, workspaceId },
    });

    if (!workspaceMember) {
      return NextResponse.json(
        { error: "User is not a member of this workspace" },
        { status: 403 }
      );
    }

    // ✅ Get latest event for this user in this workspace
    const latestEventParticipant = await prisma.eventParticipant.findFirst({
      where: { userId, event: { workspaceId } },
      orderBy: { joinedAt: "desc" }, // latest joined first
      select: { event: true },
    });

    if (!latestEventParticipant) {
      return NextResponse.json({ lastActiveEvent: null });
    }

    return NextResponse.json({ lastActiveEvent: latestEventParticipant.event });
  } catch (error) {
    console.error("Error fetching latest event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
