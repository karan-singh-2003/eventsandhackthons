import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserInfo } from '@/lib/auth-server';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: any } }
) {
  const id = context.params.id;
  const body = await req.json();

  let { name, slug } = body;

  // Step 1: Authenticate user
  const user = await getUserInfo();
  if (!user || !user.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Step 2: Check membership
  const isMember = await prisma.member.findFirst({
    where: {
      userId: user.userId,
      workspaceId: id,
    },
  });

  if (!isMember) {
    return NextResponse.json(
      { message: 'You are not a member of this workspace' },
      { status: 403 }
    );
  }

  // Step 3: Normalize slug (optional)
  if (slug) {
    slug = slug.trim().toLowerCase().replace(/\s+/g, '-');
  }

  // Step 4: Check if slug already exists in another workspace
  if (slug) {
    const existingSlug = await prisma.workspace.findFirst({
      where: {
        slug,
        NOT: { id }, // exclude current workspace
      },
    });
    if (existingSlug) {
      return NextResponse.json(
        { message: 'This workspace slug is already in use' },
        { status: 400 }
      );
    }
  }

  // Step 5: Check if workspace name already exists (optional rule)
  if (name) {
    const existingName = await prisma.workspace.findFirst({
      where: {
        name,
        NOT: { id }, // exclude current workspace
      },
    });
    if (existingName) {
      return NextResponse.json(
        { message: 'This workspace name is already in use' },
        { status: 400 }
      );
    }
  }

  // Step 6: Prepare update payload
  const updateData: { name?: string; slug?: string } = {};
  if (name) updateData.name = name;
  if (slug) updateData.slug = slug;

  try {
    // Step 7: Get old workspace details for comparison
    const oldWorkspace = await prisma.workspace.findUnique({
      where: { id },
      select: { name: true, slug: true },
    });

    const updated = await prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    // Step 8: Create notification only if name or slug changed
    if (
      (name && name !== oldWorkspace?.name) ||
      (slug && slug !== oldWorkspace?.slug)
    ) {
      await prisma.notification.create({
        data: {
          workspaceId: id,
          message: `${user.name || 'A user'} updated the workspace${
            name && name !== oldWorkspace?.name
              ? ` name to "${name}"`
              : ''
          }${
            slug && slug !== oldWorkspace?.slug
              ? ` and changed slug to "${slug}"`
              : ''
          }.`,
          userId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true, updated }, { status: 200 });
  } catch (error) {
    console.error('Update workspace error:', error);
    return NextResponse.json(
      { message: 'Failed to update workspace', error },
      { status: 500 }
    );
  }
}
