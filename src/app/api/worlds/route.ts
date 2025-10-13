import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const novelId = searchParams.get('novelId')
    const keyword = searchParams.get('q')?.trim()
    const take = Number(searchParams.get('take') || 20)

    const worlds = await db.worldBuilding.findMany({
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
        updatedAt: 'desc',
      },
      take: Math.max(1, Math.min(take, 100)),
    })

    return NextResponse.json({
      success: true,
      worlds,
    })
  } catch (error) {
    console.error('获取世界观失败:', error)
    return NextResponse.json(
      {
        error: '获取世界观失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { novelId, title, content, type } = body

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

    const world = await db.worldBuilding.create({
      data: {
        novelId,
        title: title.trim(),
        content,
        type: type || 'setting',
      },
    })

    return NextResponse.json({
      success: true,
      world,
    })
  } catch (error) {
    console.error('创建世界观失败:', error)
    return NextResponse.json(
      {
        error: '创建世界观失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}


