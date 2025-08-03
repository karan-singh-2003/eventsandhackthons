// app/api/user/last-active-workspace/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserInfo } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getUserInfo();

    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user including last active workspace relation
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        lastActiveWorkspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!dbUser?.lastActiveWorkspace) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: dbUser.lastActiveWorkspace }, { status: 200 });
  } catch (err) {
    console.error('Error fetching last active workspace:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
