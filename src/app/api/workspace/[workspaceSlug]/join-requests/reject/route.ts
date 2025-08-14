import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { workspaceSlug: string } }
) {
  try {
    const { workspaceSlug } = params
    const { requestId } = (await req.json()) as { requestId?: string }

    if (!workspaceSlug || !requestId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'workspaceSlug and requestId are required',
        },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { id: true },
    })

    if (!workspace) {
      return NextResponse.json(
        { status: 'error', message: 'Workspace not found' },
        { status: 404 }
      )
    }

    const jr = await prisma.joinRequest.findUnique({ where: { id: requestId } })
    if (!jr || jr.workspaceId !== workspace.id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Join request not found in this workspace',
        },
        { status: 404 }
      )
    }

    // Reject = delete the request (or could add a status field if needed later)
    await prisma.joinRequest.delete({ where: { id: jr.id } })

    return NextResponse.json({ status: 'success' })
  } catch (err) {
    console.error(
      'POST /api/workspace/[workspaceSlug]/join-requests/reject error:',
      err
    )
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
