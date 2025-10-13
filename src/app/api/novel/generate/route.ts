import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface GenerateRequest {
  prompt: string
  genre?: string
  style?: string
  length?: string
}

const genreMap: Record<string, string> = {
  fantasy: '奇幻玄幻',
  romance: '都市言情',
  scifi: '科幻未来',
  mystery: '悬疑推理',
  history: '历史架空',
  wuxia: '武侠仙侠'
}

const styleMap: Record<string, string> = {
  descriptive: '细腻描写',
  dialogue: '对话驱动',
  action: '动作场面',
  emotional: '情感丰富',
  humorous: '幽默风趣'
}

const lengthMap: Record<string, { min: number; max: number; description: string }> = {
  short: { min: 1000, max: 3000, description: '短篇' },
  medium: { min: 3000, max: 8000, description: '中篇' },
  long: { min: 8000, max: 15000, description: '长篇' }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, genre, style, length } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '请输入创作提示' },
        { status: 400 }
      )
    }

    // 构建 AI 提示词
    let systemPrompt = `你是一位专业的小说作家，擅长创作各种类型的小说。请根据用户的要求创作一篇精彩的小说。

写作要求：
1. 内容要原创，不要抄袭现有作品
2. 情节要引人入胜，人物形象要鲜明
3. 语言要流畅，符合中文表达习惯
4. 结构要完整，有开头、发展、高潮和结局`

    if (genre && genreMap[genre]) {
      systemPrompt += `\n5. 小说类型：${genreMap[genre]}`
    }

    if (style && styleMap[style]) {
      systemPrompt += `\n6. 写作风格：${styleMap[style]}`
    }

    if (length && lengthMap[length]) {
      const lengthInfo = lengthMap[length]
      systemPrompt += `\n7. 篇幅要求：${lengthInfo.description}，字数在${lengthInfo.min}-${lengthInfo.max}字之间`
    } else {
      systemPrompt += `\n7. 篇幅要求：中篇，字数在3000-5000字之间`
    }

    systemPrompt += `\n\n请直接开始创作小说，不要添加任何说明性文字。`

    const userPrompt = `创作主题：${prompt}`

    // 调用 ZAI 生成小说
    const zai = await ZAI.create()
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: length === 'long' ? 8000 : length === 'short' ? 2000 : 4000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('AI 生成失败')
    }

    return NextResponse.json({
      success: true,
      content: generatedContent.trim(),
      metadata: {
        genre: genre ? genreMap[genre] : '未指定',
        style: style ? styleMap[style] : '未指定',
        length: length ? lengthMap[length].description : '中篇',
        wordCount: generatedContent.length
      }
    })

  } catch (error) {
    console.error('小说生成失败:', error)
    
    return NextResponse.json(
      { 
        error: '小说生成失败，请稍后重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI 小说生成 API',
    version: '1.0.0',
    endpoints: {
      'POST /api/novel/generate': '生成小说内容'
    },
    parameters: {
      prompt: '创作提示 (必需)',
      genre: '小说类型 (可选)',
      style: '写作风格 (可选)',
      length: '篇幅长度 (可选)'
    }
  })
}