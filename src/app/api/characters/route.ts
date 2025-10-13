import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const novelId = searchParams.get('novelId')
    const keyword = searchParams.get('q')?.trim()
    const take = Number(searchParams.get('take') || 50)

    const characters = await db.character.findMany({
      where: {
        ...(novelId ? { novelId } : {}),
        ...(keyword
          ? {
              OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: Math.max(1, Math.min(take, 200)),
    })

    return NextResponse.json({
      success: true,
      characters,
    })
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json(
      {
        error: '获取角色列表失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { novelId, name, description, personality, background, relationships, avatar } = body

    if (!novelId) {
      return NextResponse.json(
        { error: '缺少 novelId 参数' },
        { status: 400 },
      )
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '角色名称不能为空' },
        { status: 400 },
      )
    }

    const character = await db.character.create({
      data: {
        novelId,
        name: name.trim(),
        description: description?.trim() || '',
        personality: personality?.trim() || null,
        background: background?.trim() || null,
        relationships: relationships?.trim() || null,
        avatar: avatar || null,
      },
    })

    return NextResponse.json({
      success: true,
      character,
    })
  } catch (error) {
    console.error('创建角色失败:', error)
    return NextResponse.json(
      {
        error: '创建角色失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    )
  }
}


