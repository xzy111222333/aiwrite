import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const characterId = params.id
    const body = await request.json()

    const { name, description, personality, background, relationships, avatar } = body

    if (name && name.trim().length === 0) {
      return NextResponse.json(
        { error: '角色名称不能为空' },
        { status: 400 }
      )
    }

    const character = await db.character.update({
      where: { id: characterId },
      data: {
        name: name?.trim() || undefined,
        description: description?.trim() ?? undefined,
        personality: personality?.trim() ?? undefined,
        background: background?.trim() ?? undefined,
        relationships: relationships?.trim() ?? undefined,
        avatar: avatar ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      character,
    })

  } catch (error) {
    console.error('更新角色失败:', error)
    return NextResponse.json(
      { 
        error: '更新角色失败',
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
    const characterId = params.id

    await db.character.delete({ where: { id: characterId } })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('删除角色失败:', error)
    return NextResponse.json(
      { 
        error: '删除角色失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}


