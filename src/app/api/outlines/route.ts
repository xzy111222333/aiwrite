import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const novelId = searchParams.get('novelId')
    const keyword = searchParams.get('q')?.trim()
    const take = Number(searchParams.get('take') || 50)

    const outlines = await db.outline.findMany({
      where: {
        ...(novelId ? { novelId } : {}),
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: 'insensitive' } },
                { content: { contains: keyword, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        order: 'asc',
      },
      take: Math.max(1, Math.min(take, 200)),
    })

    return NextResponse.json({
      success: true,
      outlines,
    })
  } catch (error) {
    console.error('获取大纲失败:', error)
    return NextResponse.json(
      {
        error: '获取大纲失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { novelId, title, content, chapterRange, order } = body

    if (!novelId) {
      return NextResponse.json(
        { error: '缺少 novelId 参数' },
        { status: 400 },
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 },
      )
    }

    const outline = await db.outline.create({
      data: {
        novelId,
        title: title.trim(),
        content,
        chapterRange: chapterRange?.trim() || null,
        order:
          typeof order === 'number'
            ? order
            : (await db.outline.count({ where: { novelId } })) + 1,
      },
    })

    return NextResponse.json({
      success: true,
      outline,
    })
  } catch (error) {
    console.error('创建大纲失败:', error)
    return NextResponse.json(
      {
        error: '创建大纲失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}


