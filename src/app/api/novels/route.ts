import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { recalculateNovelStats } from '@/lib/novel-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const status = searchParams.get('status')?.trim()
    const sort = searchParams.get('sort') || 'updatedAt'
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
    const tag = searchParams.get('tag')?.trim()

    const novels = await db.novel.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          status ? { status } : {},
          tag
            ? {
                tags: {
                  contains: tag,
                },
              }
            : {},
        ],
      },
      orderBy:
        sort === 'createdAt'
          ? { createdAt: order }
          : sort === 'title'
            ? { title: order }
            : { updatedAt: order },
      include: {
        chapters: {
          select: {
            id: true,
            title: true,
            wordCount: true,
            order: true,
            status: true,
            updatedAt: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        characters: {
          select: {
            id: true,
            name: true,
            description: true,
            avatar: true,
            relationships: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        worldBuilding: true,
        outlines: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            chapters: true,
            characters: true,
          },
        },
      },
    })

    const novelsWithStats = novels.map((novel) => ({
      ...novel,
      wordCount: novel.chapters.reduce((total, chapter) => total + chapter.wordCount, 0),
      chapterCount: novel.chapters.length,
      tags: novel.tags ? JSON.parse(novel.tags) : [],
    }))

    return NextResponse.json({
      success: true,
      novels: novelsWithStats,
    })

  } catch (error) {
    console.error('获取小说列表失败:', error)
    return NextResponse.json(
      { 
        error: '获取小说列表失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, genre, tags, coverImage } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: '小说标题不能为空' },
        { status: 400 }
      )
    }

    const novel = await db.novel.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        genre: genre || null,
        status: 'draft',
        tags: Array.isArray(tags) ? JSON.stringify(tags) : null,
        coverImage: coverImage || null,
      },
    })

    await recalculateNovelStats(novel.id)

    return NextResponse.json({
      success: true,
      novel: {
        ...novel,
        tags: Array.isArray(tags) ? tags : [],
        wordCount: 0,
        chapterCount: 0,
      },
    })

  } catch (error) {
    console.error('创建小说失败:', error)
    return NextResponse.json(
      { 
        error: '创建小说失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}