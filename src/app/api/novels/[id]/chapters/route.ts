import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { normaliseWordCount, recalculateNovelStats } from '@/lib/novel-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapters = await db.chapter.findMany({
      where: {
        novelId: params.id,
      },
      orderBy: {
        order: 'asc'
      },
    })

    return NextResponse.json({
      success: true,
      chapters,
    })

  } catch (error) {
    console.error('获取章节列表失败:', error)
    return NextResponse.json(
      { 
        error: '获取章节列表失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    const body = await request.json()
    const { title, content, order, summary, status } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: '章节标题不能为空' },
        { status: 400 }
      )
    }

    const payloadContent = typeof content === 'string' ? content : ''

    const chapter = await db.chapter.create({
      data: {
        title: title.trim(),
        content: payloadContent,
        wordCount: normaliseWordCount(payloadContent),
        order:
          typeof order === 'number'
            ? order
            : (await db.chapter.count({ where: { novelId } })) + 1,
        summary: summary?.trim() || null,
        status: status || 'draft',
        novelId: novelId,
      },
    })

    await recalculateNovelStats(novelId)

    return NextResponse.json({
      success: true,
      chapter,
    })

  } catch (error) {
    console.error('创建章节失败:', error)
    return NextResponse.json(
      { 
        error: '创建章节失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = params.id
    const body = await request.json()
    const { chapterIds } = body

    if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
      return NextResponse.json(
        { error: '缺少章节列表' },
        { status: 400 }
      )
    }

    const chapters = await db.chapter.findMany({
      where: { novelId, id: { in: chapterIds } },
      select: { id: true },
    })

    if (chapters.length !== chapterIds.length) {
      return NextResponse.json(
        { error: '章节列表包含无效 ID' },
        { status: 400 }
      )
    }

    await db.$transaction(
      chapterIds.map((chapterId: string, index: number) =>
        db.chapter.update({
          where: { id: chapterId },
          data: { order: index + 1 },
        })
      )
    )

    await recalculateNovelStats(novelId)

    return NextResponse.json({
      success: true,
    })

  } catch (error) {
    console.error('章节排序更新失败:', error)
    return NextResponse.json(
      { 
        error: '章节排序更新失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}