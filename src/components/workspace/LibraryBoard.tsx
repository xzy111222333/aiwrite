'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { BookOpenCheck, EllipsisVertical, Grid2X2, LayoutList, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LibraryBoardNovel {
  id: string
  title: string
  description?: string | null
  status: string
  chapterCount: number
  wordCount: number
  updatedAt: string
  tags?: string[]
  genre?: string | null
}

interface LibraryBoardProps {
  novels: LibraryBoardNovel[]
  onSelect: (novelId: string) => void
  onCreate: () => void
  onRename: (novelId: string) => void
  onDelete: (novelId: string) => void
}

const statusLabelMap: Record<string, string> = {
  draft: '草稿',
  writing: '创作中',
  completed: '已完结',
  published: '已发布'
}

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'writing', label: '创作中' },
  { value: 'completed', label: '已完结' },
  { value: 'published', label: '已发布' }
]

export function LibraryBoard({ novels, onSelect, onCreate, onRename, onDelete }: LibraryBoardProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const filteredNovels = useMemo(() => {
    return novels
      .filter((novel) => {
        if (statusFilter !== 'all' && novel.status !== statusFilter) {
          return false
        }
        if (!search.trim()) return true
        const fragments = [novel.title, novel.description, novel.genre, ...(novel.tags ?? [])].filter(Boolean)
        return fragments.some((fragment) =>
          fragment!.toLowerCase().includes(search.trim().toLowerCase())
        )
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [novels, search, statusFilter])

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border/60 bg-card/60 p-8 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">作品库</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">管理你的所有作品</h1>
            <p className="text-sm text-muted-foreground">
              支持按状态筛选、快速进入写作模式，全面掌控创作进度。
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')} className="rounded-xl border-2">
              {layout === 'grid' ? <LayoutList className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
            </Button>
            <Button onClick={onCreate} className="rounded-xl bg-primary px-6 text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              新建作品
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[320px_200px]">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">搜索作品</Label>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="输入作品标题、标签或描写关键词"
              className="h-11 rounded-xl border-2"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">状态筛选</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className={cn(
          'mx-auto w-full max-w-6xl gap-5 px-8 py-8',
          layout === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'
        )}>
          {filteredNovels.map((novel) => (
            <Card
              key={novel.id}
              className={cn(
                'group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg',
                layout === 'list' && 'flex flex-col md:flex-row'
              )}
            >
              <CardHeader className="space-y-3 p-6 pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-foreground">{novel.title}</CardTitle>
                    <p className="mt-2 text-xs text-muted-foreground">
                      最近更新：{new Date(novel.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-2xl">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem onClick={() => onRename(novel.id)}>重命名</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(novel.id)}>
                        删除作品
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {novel.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{novel.description}</p>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5 p-6 pt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">状态</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {statusLabelMap[novel.status] ?? novel.status}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">章节数</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{novel.chapterCount} 章</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">总字数</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {novel.wordCount.toLocaleString()} 字
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/40 p-3">
                    <p className="text-xs text-muted-foreground">类型</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{novel.genre ?? '暂未设置'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(novel.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(novel.tags ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">暂无标签</span>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    <span>点击进入写作工作台</span>
                  </div>
                  <Button onClick={() => onSelect(novel.id)} className="rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                    前往写作
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredNovels.length === 0 && (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-border/60 bg-card/40 p-16 text-center">
              <p className="text-base text-muted-foreground">
                暂无匹配的作品，尝试调整筛选条件或点击「新建作品」开始创作。
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

