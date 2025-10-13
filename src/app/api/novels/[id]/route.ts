import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novel = await db.novel.findUnique({
      where: { id: params.id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
        characters: {
          orderBy: { createdAt: 'desc' },
        },
        outlines: {
          orderBy: { order: 'asc' },
        },
        worldBuilding: true,
      },
    })

    if (!novel) {
      return NextResponse.json(
        { error: '未找到小说' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      novel: {
        ...novel,
        tags: novel.tags ? JSON.parse(novel.tags) : [],
      },
    })

  } catch (error) {
    console.error('获取小说详情失败:', error)
    return NextResponse.json(
      { 
        error: '获取小说详情失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, genre, status, coverImage, tags } = body

    if (title && title.trim().length === 0) {
      return NextResponse.json(
        { error: '小说标题不能为空' },
        { status: 400 }
      )
    }

    const novel = await db.novel.update({
      where: { id: params.id },
      data: {
        title: title?.trim() || undefined,
        description: description?.trim() ?? undefined,
        genre: genre ?? undefined,
        status: status ?? undefined,
        coverImage: coverImage ?? undefined,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : undefined,
      },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      novel: {
        ...novel,
        tags: Array.isArray(tags)
          ? tags
          : novel.tags
            ? JSON.parse(novel.tags)
            : [],
      },
    })

  } catch (error) {
    console.error('更新小说失败:', error)
    return NextResponse.json(
      { 
        error: '更新小说失败',
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
    await db.novel.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('删除小说失败:', error)
    return NextResponse.json(
      { 
        error: '删除小说失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}


