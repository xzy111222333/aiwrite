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
import { Copy, RefreshCw, User, Sparkles } from 'lucide-react'

export function CharacterGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [characterData, setCharacterData] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    personality: '',
    background: '',
    storyContext: ''
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setCharacterData(data.character)
      }
    } catch (error) {
      console.error('生成角色失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(characterData)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">角色姓名</Label>
            <Input
              id="name"
              placeholder="输入角色姓名（可选）"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="role">角色定位</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择角色定位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protagonist">主角</SelectItem>
                <SelectItem value="antagonist">反派</SelectItem>
                <SelectItem value="supporting">配角</SelectItem>
                <SelectItem value="mentor">导师</SelectItem>
                <SelectItem value="love_interest">恋爱对象</SelectItem>
                <SelectItem value="friend">朋友</SelectItem>
                <SelectItem value="family">家人</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="personality">性格特征</Label>
            <Textarea
              id="personality"
              placeholder="描述角色的性格特点..."
              value={formData.personality}
              onChange={(e) => setFormData({...formData, personality: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="background">背景要求</Label>
            <Textarea
              id="background"
              placeholder="描述角色的背景要求..."
              value={formData.background}
              onChange={(e) => setFormData({...formData, background: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="storyContext">故事背景</Label>
            <Textarea
              id="storyContext"
              placeholder="描述故事的整体背景..."
              value={formData.storyContext}
              onChange={(e) => setFormData({...formData, storyContext: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              AI 正在生成角色...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成角色
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

      {characterData && !isGenerating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                角色设定
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
                  {characterData}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}