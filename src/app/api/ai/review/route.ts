import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const FOCUS_DESCRIPTIONS: Record<string, string> = {
  plot: '分析剧情逻辑、冲突设置以及节奏安排是否合理。',
  character: '关注人物动机、性格一致性与成长曲线。',
  style: '评估语言风格、叙述视角以及氛围营造。',
  pacing: '检查段落节奏、转场衔接与张弛节奏。',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, focus = ['plot', 'character', 'style'] } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: '审稿文本不能为空' },
        { status: 400 }
      )
    }

    const focusText = (Array.isArray(focus) ? focus : [])
      .map((item: string) => FOCUS_DESCRIPTIONS[item])
      .filter(Boolean)
      .join('\n')

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            '你是一名严谨的小说编辑，请针对用户提供的文本进行审稿，并输出 JSON：{"strengths": ["..."], "issues": ["..."], "suggestions": ["..."], "scoring": {"plot": 0-10, "character": 0-10, "style": 0-10}}。issues 字段描述需要改进的问题，suggestions 给出可执行的修改建议。只返回 JSON。',
        },
        {
          role: 'user',
          content: `需要审稿的文本：\n${content}\n\n重点关注：\n${focusText || '综合评估'}\n\n请返回 JSON。`,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
      top_p: 0.8,
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const trimmed = raw.trim().replace(/```json|```/g, '')

    let parsed: ReviewResult
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      throw new Error('AI 返回结果解析失败')
    }

    return NextResponse.json({
      success: true,
      review: {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        scoring: parsed.scoring,
      },
    })
  } catch (error) {
    console.error('AI 审稿失败:', error)
    return NextResponse.json(
      {
        error: '审稿失败，请稍后重试',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

interface ReviewResult {
  strengths?: string[]
  issues?: string[]
  suggestions?: string[]
  scoring?: {
    plot?: number
    character?: number
    style?: number
  }
}

