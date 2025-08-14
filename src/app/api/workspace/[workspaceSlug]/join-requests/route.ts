'use server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = await params
    if (!workspaceSlug) {
      return NextResponse.json(
        { status: 'error', message: 'workspaceSlug is required' },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: {
        id: true,
        joinRequests: {
          include: {
            user: true,
            role: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!workspace) {
      return NextResponse.json(
        { status: 'error', message: 'Workspace not found' },
        { status: 404 }
      )
    }

    const requests = workspace.joinRequests.map((jr) => ({
      id: jr.id,
      name: jr.user.name ?? jr.user.universityId ?? 'Unknown',
      email: jr.user.email ?? '',
      role: jr.role.name,
      requestedAt: jr.createdAt.toISOString(),
      URN: jr.user.universityId,
      note: undefined as string | undefined,
    }))

    return NextResponse.json({ status: 'success', requests })
  } catch (err) {
    console.error(
      'GET /api/workspace/[workspaceSlug]/join-requests error:',
      err
    )
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
