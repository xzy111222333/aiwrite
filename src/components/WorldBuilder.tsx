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
import { Copy, RefreshCw, Globe, Sparkles } from 'lucide-react'

export function WorldBuilder() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [worldData, setWorldData] = useState('')
  const [formData, setFormData] = useState({
    worldName: '',
    worldType: '',
    timePeriod: '',
    technology: '',
    magic: '',
    geography: '',
    culture: '',
    politics: '',
    religion: '',
    additional: ''
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setWorldData(data.world)
      }
    } catch (error) {
      console.error('生成世界观失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(worldData)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="worldName">世界名称</Label>
            <Input
              id="worldName"
              placeholder="输入世界名称（可选）"
              value={formData.worldName}
              onChange={(e) => setFormData({...formData, worldName: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="worldType">世界类型</Label>
            <Select value={formData.worldType} onValueChange={(value) => setFormData({...formData, worldType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择世界类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fantasy">奇幻世界</SelectItem>
                <SelectItem value="scifi">科幻世界</SelectItem>
                <SelectItem value="modern">现代都市</SelectItem>
                <SelectItem value="historical">历史架空</SelectItem>
                <SelectItem value="post_apocalyptic">末世废土</SelectItem>
                <SelectItem value="steampunk">蒸汽朋克</SelectItem>
                <SelectItem value="cyberpunk">赛博朋克</SelectItem>
                <SelectItem value="wuxia">武侠世界</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timePeriod">时代背景</Label>
            <Input
              id="timePeriod"
              placeholder="如：中世纪、未来、现代等"
              value={formData.timePeriod}
              onChange={(e) => setFormData({...formData, timePeriod: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="geography">地理环境</Label>
            <Textarea
              id="geography"
              placeholder="描述地理环境、气候、地形等..."
              value={formData.geography}
              onChange={(e) => setFormData({...formData, geography: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="technology">科技水平</Label>
            <Textarea
              id="technology"
              placeholder="描述科技发展水平..."
              value={formData.technology}
              onChange={(e) => setFormData({...formData, technology: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="magic">魔法系统</Label>
            <Textarea
              id="magic"
              placeholder="描述魔法体系或超自然力量..."
              value={formData.magic}
              onChange={(e) => setFormData({...formData, magic: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="culture">文化特色</Label>
            <Textarea
              id="culture"
              placeholder="描述文化、艺术、习俗等..."
              value={formData.culture}
              onChange={(e) => setFormData({...formData, culture: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="politics">政治体系</Label>
            <Textarea
              id="politics"
              placeholder="描述政治制度、社会结构..."
              value={formData.politics}
              onChange={(e) => setFormData({...formData, politics: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="additional">其他设定</Label>
        <Textarea
          id="additional"
          placeholder="其他需要补充的世界观设定..."
          value={formData.additional}
          onChange={(e) => setFormData({...formData, additional: e.target.value})}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              AI 正在构建世界...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              构建世界观
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
            </div>
          </CardContent>
        </Card>
      )}

      {worldData && !isGenerating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                世界观设定
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {worldData}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}