import { NextRequest, NextResponse } from 'next/server'
import { createDoubaoAI, WRITING_SYSTEM_PROMPT } from '@/lib/doubao'

interface GenerateRequest {
  prompt: string
  genre?: string
  style?: string
  length?: string
}

const genreMap: Record<string, string> = {
  fantasy: '濂囧够鐜勫够',
  romance: '閮藉競瑷€鎯ￄ1�7',
  scifi: '绉戝够鏈潵',
  mystery: '鎮枒鎺ㄧ悊',
  history: '鍘嗗彶鏋剁┖',
  wuxia: '姝︿緺浠欎緺'
}

const styleMap: Record<string, string> = {
  descriptive: '缁嗚吇鎻忓啓',
  dialogue: '瀵硅瘽椹卞姩',
  action: '鍔ㄤ綔鍦洪潰',
  emotional: '鎯呮劅涓板瘜',
  humorous: '骞介粯椋庤叮'
}

const lengthMap: Record<string, { min: number; max: number; description: string }> = {
  short: { min: 1000, max: 3000, description: '鐭瘄1�7' },
  medium: { min: 3000, max: 8000, description: '涓瘄1�7' },
  long: { min: 8000, max: 15000, description: '闢�跨瘒' }
}

// src/app/api/novel/generate/route.ts - �޸� POST ����
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, genre, style, length } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '�����봴����ʾ' },
        { status: 400 }
      )
    }

    // ������ʽ��Ӧ
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ai = await createDoubaoAI()
          
          // ������ʾ�ʣ�ͬ�ϣ�
          let systemPrompt = `${WRITING_SYSTEM_PROMPT}\n\n## С˵����ר��Ҫ��...`
          
          const completion = await ai.chat_completions.create({
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `�������⣺${prompt}`
              }
            ],
            temperature: 0.8,
            max_tokens: length === 'long' ? 8000 : length === 'short' ? 2000 : 4000,
            top_p: 0.9,
            stream: true // ������ʽ����
          })

          // ��ʽ������Ӧ
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          
          controller.close()
        } catch (error) {
          console.error('AI ����ʧ��:', error)
          controller.enqueue(encoder.encode('\n\n������ʧ�ܣ������ԡ�'))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('С˵����ʧ��:', error)
    return NextResponse.json(
      {
        error: 'С˵����ʧ�ܣ����Ժ�����',
        details: error instanceof Error ? error.message : 'δ֪����'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI 灏忚鐢熸垚 API',
    version: '1.0.0',
    endpoints: {
      'POST /api/novel/generate': '鐢熸垚灏忚鍐呭1�7'
    },
    parameters: {
      prompt: '鍒涗綔鎻愮ず (蹇呴渄1�7)',
      genre: '灏忚绫诲��1�7 (鍙€�)',
      style: '鍐欎綔椋庢牸 (鍙€�)',
      length: '绡囧箙闀垮害 (鍙€�)'
    }
  })
}