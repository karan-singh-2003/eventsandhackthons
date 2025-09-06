import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const workspaceSlug = searchParams.get("workspaceSlug");

  if (!name || !workspaceSlug) {
    return NextResponse.json({ exists: false });
  }

  // Normalize name
  const normalizedName = name.toLowerCase().trim();

  // Find workspace first
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: { id: true },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check event in that workspace
  const event = await prisma.event.findFirst({
  where: {
    workspaceId: workspace.id,
    name: {
      equals: name, // use raw user input
      mode: "insensitive",
    },
  },
});


  return NextResponse.json({ exists: !!event });
}
