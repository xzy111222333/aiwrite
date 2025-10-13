'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw, Edit, Sparkles, Download } from 'lucide-react'

export function ContinueWriting() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [originalContent, setOriginalContent] = useState('')
  const [continuedContent, setContinuedContent] = useState('')
  const [formData, setFormData] = useState({
    context: '',
    style: '',
    length: '800',
    direction: ''
  })

  const handleGenerate = async () => {
    if (!originalContent.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/continue-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent,
          context: formData.context,
          style: formData.style,
          length: parseInt(formData.length),
          direction: formData.direction
        })
      })

      const data = await response.json()
      if (data.success) {
        setContinuedContent(data.content)
      }
    } catch (error) {
      console.error('续写失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      const fullContent = originalContent + '\n\n' + continuedContent
      await navigator.clipboard.writeText(fullContent)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const handleDownload = () => {
    const fullContent = originalContent + '\n\n' + continuedContent
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '续写内容.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getWordCount = (text: string) => {
    return text.replace(/\s/g, '').length
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="originalContent">原文内容 *</Label>
            <Textarea
              id="originalContent"
              placeholder="粘贴需要续写的原文内容..."
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <div className="text-sm text-gray-500 mt-1">
              字数：{getWordCount(originalContent)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="context">故事背景</Label>
            <Textarea
              id="context"
              placeholder="描述故事的整体背景（可选）..."
              value={formData.context}
              onChange={(e) => setFormData({...formData, context: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="direction">续写方向</Label>
            <Textarea
              id="direction"
              placeholder="描述希望续写的方向和重点..."
              value={formData.direction}
              onChange={(e) => setFormData({...formData, direction: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">写作风格</Label>
              <Select value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择风格" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="descriptive">细腻描写</SelectItem>
                  <SelectItem value="dialogue">对话驱动</SelectItem>
                  <SelectItem value="action">动作场面</SelectItem>
                  <SelectItem value="emotional">情感丰富</SelectItem>
                  <SelectItem value="humorous">幽默风趣</SelectItem>
                  <SelectItem value="suspenseful">悬疑紧张</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="length">续写长度</Label>
              <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择长度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">短续写 (400字)</SelectItem>
                  <SelectItem value="800">中续写 (800字)</SelectItem>
                  <SelectItem value="1200">长续写 (1200字)</SelectItem>
                  <SelectItem value="2000">超长续写 (2000字)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !originalContent.trim()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              AI 正在续写...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              开始续写
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

      {continuedContent && !isGenerating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                续写结果
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getWordCount(continuedContent)} 字
                </Badge>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制全文
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">原文内容</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed">
                    {originalContent}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">续写内容</h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {continuedContent}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}