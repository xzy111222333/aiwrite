import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worldId = params.id
    const body = await request.json()

    const { title, content, type } = body

    if (title !== undefined && title.trim().length === 0) {
      return NextResponse.json(
        { error: '标题不能为空' },
        { status: 400 }
      )
    }

    const world = await db.worldBuilding.update({
      where: { id: worldId },
      data: {
        title: title?.trim() || undefined,
        content: content ?? undefined,
        type: type ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      world,
    })
  } catch (error) {
    console.error('更新世界观失败:', error)
    return NextResponse.json(
      {
        error: '更新世界观失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worldId = params.id

    await db.worldBuilding.delete({ where: { id: worldId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除世界观失败:', error)
    return NextResponse.json(
      {
        error: '删除世界观失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}


