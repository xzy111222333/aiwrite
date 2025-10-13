'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, Save, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ChapterComposerProps {
  novelId?: string
  chapterId?: string
  onSaved?: () => void
}

interface ChapterPayload {
  id: string
  title: string
  content: string
  summary?: string | null
  status: string
}

export function ChapterComposer({ novelId, chapterId, onSaved }: ChapterComposerProps) {
  const { toast } = useToast()
  const [chapter, setChapter] = useState<ChapterPayload | null>(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState('draft')
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiContext, setAiContext] = useState('')
  const [aiDirection, setAiDirection] = useState('')
  const [aiLength, setAiLength] = useState('800')
  const [isGenerating, setIsGenerating] = useState(false)

  const wordCount = useMemo(() => content.replace(/\s+/g, '').length, [content])

  useEffect(() => {
    if (!chapterId) {
      setChapter(null)
      setContent('')
      setTitle('')
      setSummary('')
      setStatus('draft')
      return
    }

    const loadChapter = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/chapters/${chapterId}`)
        if (!response.ok) {
          throw new Error('加载章节失败')
        }
        const data = await response.json()
        if (data.success) {
          setChapter(data.chapter)
          setContent(data.chapter.content)
          setTitle(data.chapter.title)
          setSummary(data.chapter.summary || '')
          setStatus(data.chapter.status)
        }
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          description: error instanceof Error ? error.message : '章节加载失败',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadChapter()
  }, [chapterId, toast])

  const handleSave = async () => {
    if (!chapterId) {
      toast({ variant: 'destructive', description: '请选择一个章节' })
      return
    }

    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          summary,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error('保存章节失败')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || '保存失败')
      }

      toast({ description: '章节内容已保存' })
      onSaved?.()
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : '章节保存失败',
      })
    }
  }

  const handleGenerateContinuation = async () => {
    if (!content.trim()) {
      toast({ variant: 'destructive', description: '请先填写原始章节内容' })
      return
    }
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/continue-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          context: aiContext,
          direction: aiDirection,
          length: Number(aiLength) || 800,
        }),
      })

      if (!response.ok) {
        throw new Error('生成续写失败')
      }

      const data = await response.json()
      if (data.success) {
        setAiSuggestion(data.content)
        toast({ description: '续写内容已生成' })
      } else {
        throw new Error(data.error || '生成失败')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : '续写失败',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const appendSuggestion = () => {
    if (!aiSuggestion) return
    setContent((prev) => `${prev}\n\n${aiSuggestion}`)
    setAiSuggestion('')
  }

  return (
    <Card className="border border-border bg-card rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">章节编辑器</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">实时自动保存前请手动点击保存按钮</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full border-2">{wordCount} 字</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="grid gap-5">
          <div className="grid gap-3">
            <Label className="text-sm font-semibold text-foreground">章节标题</Label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：第一章 重返星港"
              className="rounded-xl border-2"
            />
          </div>
          <div className="grid gap-3">
            <Label className="text-sm font-semibold text-foreground">章节摘要</Label>
            <Textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="简要描述本章关键剧情"
              rows={3}
              className="rounded-xl border-2"
            />
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-xl p-1">
            <TabsTrigger value="editor" className="rounded-lg font-medium">正文内容</TabsTrigger>
            <TabsTrigger value="assistant" className="rounded-lg font-medium">AI 助手</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6 space-y-5">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="开始书写章节内容..."
              minRows={20}
              className="min-h-[480px] resize-y rounded-xl border-2 font-mono text-sm leading-relaxed"
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium">
                <Save className="mr-2 h-4 w-4" /> 保存章节
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Label className="text-sm font-semibold text-foreground">状态</Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'draft', label: '草稿' },
                  { value: 'writing', label: '写作中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'published', label: '已发布' },
                ].map((item) => (
                  <Button
                    key={item.value}
                    variant={status === item.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatus(item.value)}
                    className="rounded-full border-2 font-medium"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="mt-6 space-y-5">
            <div className="space-y-4 rounded-xl border border-border bg-secondary/20 p-5">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">上下文信息</Label>
                <Textarea
                  value={aiContext}
                  onChange={(event) => setAiContext(event.target.value)}
                  placeholder="补充上下文、人物变化等"
                  rows={4}
                  className="rounded-xl border-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">剧情方向</Label>
                <Textarea
                  value={aiDirection}
                  onChange={(event) => setAiDirection(event.target.value)}
                  placeholder="告诉 AI 本段需要出现的转折或重点"
                  rows={4}
                  className="rounded-xl border-2"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-sm font-semibold text-foreground">续写长度</Label>
                <Input
                  value={aiLength}
                  onChange={(event) => setAiLength(event.target.value)}
                  className="w-28 rounded-lg border-2"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium"
                onClick={handleGenerateContinuation}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    正在续写
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成续写建议
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={!aiSuggestion} onClick={appendSuggestion} className="rounded-xl border-2 font-medium">
                插入续写内容
              </Button>
            </div>

            {aiSuggestion && (
              <ScrollArea className="max-h-[280px] rounded-xl border-2 border-border bg-card p-5 text-sm leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans text-foreground">{aiSuggestion}</pre>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


