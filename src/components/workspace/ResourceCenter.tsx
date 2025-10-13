'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { NovelOverview } from './NovelOverview'
import { BookMarked, Sparkles } from 'lucide-react'

interface ResourceCenterNovel {
  id: string
  title: string
  updatedAt: string
}

interface ResourceCenterProps {
  novels: ResourceCenterNovel[]
  selectedNovelId?: string
  onSelectNovel: (novelId: string) => void
  novelDetail?: Parameters<typeof NovelOverview>[0]['novel']
  onOpenTool: (tool: string) => void
}

export function ResourceCenter({
  novels,
  selectedNovelId,
  onSelectNovel,
  novelDetail,
  onOpenTool
}: ResourceCenterProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="border-b border-border/60 bg-card/60 px-8 py-6 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">资料中心</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">全景掌握世界观与角色档案</h1>
            <p className="text-sm text-muted-foreground">
              统一管理角色设定、故事大纲与世界观资料，点击下方快捷按钮可快速调出对应的 AI 工作室。
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:min-w-[260px]">
            <Select value={selectedNovelId} onValueChange={onSelectNovel}>
              <SelectTrigger className="h-11 rounded-xl border-2">
                <SelectValue placeholder="选择作品" />
              </SelectTrigger>
              <SelectContent>
                {novels.map((novel) => (
                  <SelectItem key={novel.id} value={novel.id}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium">{novel.title}</span>
                      <span className="text-xs text-muted-foreground">{new Date(novel.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenTool('ai-write')} className="rounded-lg border-2">
                <Sparkles className="mr-2 h-4 w-4" /> AI 写作
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenTool('outline')} className="rounded-lg border-2">
                <BookMarked className="mr-2 h-4 w-4" /> 生成大纲
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenTool('character')} className="rounded-lg border-2">
                <Sparkles className="mr-2 h-4 w-4" /> 角色设定
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenTool('more')} className="rounded-lg border-2">
                <BookMarked className="mr-2 h-4 w-4" /> 世界观工具
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          {novelDetail ? (
            <NovelOverview novel={novelDetail} />
          ) : (
            <Card className="rounded-3xl border border-dashed border-border/60 bg-card/50 p-16 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs tracking-[0.24em] uppercase">
                  资料中心
                </Badge>
                <h2 className="text-xl font-semibold text-foreground">请选择左侧作品以查看资料</h2>
                <p className="text-sm text-muted-foreground">
                  支持查看章节概览、角色档案、故事大纲与世界观设定，也可以通过上方快捷按钮直接打开 AI 工具，生成新的资料并保存。
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

