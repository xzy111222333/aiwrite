import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { normaliseWordCount, recalculateNovelStats } from '@/lib/novel-helpers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    const body = await request.json()

    const existing = await db.chapter.findUnique({
      where: { id: chapterId },
      select: { novelId: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: '未找到章节' },
        { status: 404 }
      )
    }

    const { title, content, summary, status, order } = body

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        title: title?.trim() || undefined,
        content: content ?? undefined,
        summary: summary?.trim() ?? undefined,
        status: status ?? undefined,
        order: typeof order === 'number' ? order : undefined,
        wordCount: typeof content === 'string' ? normaliseWordCount(content) : undefined,
      },
    })

    await recalculateNovelStats(existing.novelId)

    return NextResponse.json({
      success: true,
      chapter,
    })

  } catch (error) {
    console.error('更新章节失败:', error)
    return NextResponse.json(
      { 
        error: '更新章节失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await db.chapter.findUnique({ where: { id: params.id } })

    if (!chapter) {
      return NextResponse.json(
        { error: '未找到章节' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, chapter })

  } catch (error) {
    console.error('查询章节失败:', error)
    return NextResponse.json(
      {
        error: '查询章节失败',
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
    const chapterId = params.id

    const existing = await db.chapter.findUnique({
      where: { id: chapterId },
      select: { novelId: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: '未找到章节' },
        { status: 404 }
      )
    }

    await db.chapter.delete({ where: { id: chapterId } })

    await recalculateNovelStats(existing.novelId)

    return NextResponse.json({
      success: true,
    })

  } catch (error) {
    console.error('删除章节失败:', error)
    return NextResponse.json(
      { 
        error: '删除章节失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}


