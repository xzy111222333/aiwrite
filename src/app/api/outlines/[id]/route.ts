import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const outlineId = params.id
    const body = await request.json()

    const { title, content, chapterRange, order } = body

    if (title && title.trim().length === 0) {
      return NextResponse.json(
        { error: '标题不能为空' },
        { status: 400 }
      )
    }

    const outline = await db.outline.update({
      where: { id: outlineId },
      data: {
        title: title?.trim() || undefined,
        content: content ?? undefined,
        chapterRange: chapterRange?.trim() ?? undefined,
        order: typeof order === 'number' ? order : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      outline,
    })

  } catch (error) {
    console.error('更新大纲失败:', error)
    return NextResponse.json(
      { 
        error: '更新大纲失败',
        details: error instanceof Error ? error.message : '未知错误'
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
    const outlineId = params.id

    await db.outline.delete({ where: { id: outlineId } })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('删除大纲失败:', error)
    return NextResponse.json(
      { 
        error: '删除大纲失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}


