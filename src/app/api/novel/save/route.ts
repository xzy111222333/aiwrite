import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'API 已废弃，请使用新的 /api/novels 接口。' },
    { status: 410 },
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'API 已废弃，请使用新的 /api/novels 接口。' },
    { status: 410 },
  )
}
