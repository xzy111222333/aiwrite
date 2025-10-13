'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw, Target, Sparkles } from 'lucide-react'

export function OutlineGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [outlineData, setOutlineData] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    mainPlot: '',
    characters: [] as string[],
    chapterCount: '20',
    style: ''
  })

  const handleGenerate = async () => {
    if (!formData.title.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          chapterCount: parseInt(formData.chapterCount)
        })
      })

      const data = await response.json()
      if (data.success) {
        setOutlineData(data.outline)
      }
    } catch (error) {
      console.error('生成大纲失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outlineData)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const addCharacter = (character: string) => {
    if (character.trim() && !formData.characters.includes(character.trim())) {
      setFormData({
        ...formData,
        characters: [...formData.characters, character.trim()]
      })
    }
  }

  const removeCharacter = (index: number) => {
    setFormData({
      ...formData,
      characters: formData.characters.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">小说标题 *</Label>
            <Input
              id="title"
              placeholder="输入小说标题"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="genre">小说类型</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择小说类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fantasy">奇幻玄幻</SelectItem>
                <SelectItem value="romance">都市言情</SelectItem>
                <SelectItem value="scifi">科幻未来</SelectItem>
                <SelectItem value="mystery">悬疑推理</SelectItem>
                <SelectItem value="history">历史架空</SelectItem>
                <SelectItem value="wuxia">武侠仙侠</SelectItem>
                <SelectItem value="realistic">现实主义</SelectItem>
                <SelectItem value="youth">青春校园</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chapterCount">章节数量</Label>
            <Select value={formData.chapterCount} onValueChange={(value) => setFormData({...formData, chapterCount: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择章节数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10章</SelectItem>
                <SelectItem value="20">20章</SelectItem>
                <SelectItem value="30">30章</SelectItem>
                <SelectItem value="50">50章</SelectItem>
                <SelectItem value="100">100章</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="mainPlot">主要情节</Label>
            <Textarea
              id="mainPlot"
              placeholder="描述故事的主要情节和核心冲突..."
              value={formData.mainPlot}
              onChange={(e) => setFormData({...formData, mainPlot: e.target.value})}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="style">写作风格</Label>
            <Textarea
              id="style"
              placeholder="描述希望的写作风格..."
              value={formData.style}
              onChange={(e) => setFormData({...formData, style: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>主要人物</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.characters.map((character, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCharacter(index)}>
              {character} ×
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="输入人物名称后按回车添加"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addCharacter((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={(e) => {
              const input = e.currentTarget.parentElement?.querySelector('input')
              if (input) {
                addCharacter(input.value)
                input.value = ''
              }
            }}
          >
            添加
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !formData.title.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              AI 正在生成大纲...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成大纲
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      )}

      {outlineData && !isGenerating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                故事大纲
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {outlineData}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}