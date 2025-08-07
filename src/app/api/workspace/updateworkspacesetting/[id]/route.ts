import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserInfo } from '@/lib/auth-server';

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
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

  // Step 4: Prepare update payload
  const updateData: { name?: string; slug?: string } = {};
  if (name) updateData.name = name;
  if (slug) updateData.slug = slug;

  try {
    const updated = await prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, updated }, { status: 200 });
  } catch (error) {
    console.error('Update workspace error:', error);
    return NextResponse.json(
      { message: 'Failed to update workspace', error },
      { status: 500 }
    );
  }
}
