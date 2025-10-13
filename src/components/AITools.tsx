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
import { Copy, RefreshCw, User, Sparkles, Globe, Target, Edit3, Lightbulb } from 'lucide-react'

interface AIToolProps {
  isDarkMode: boolean
  onToolComplete?: (result: string) => void
}

export function CharacterGenerator({ isDarkMode, onToolComplete }: AIToolProps) {
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
        onToolComplete?.(data.character)
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
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
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
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>

          <div>
            <Label htmlFor="storyContext">故事背景</Label>
            <Textarea
              id="storyContext"
              placeholder="描述故事的整体背景..."
              value={formData.storyContext}
              onChange={(e) => setFormData({...formData, storyContext: e.target.value})}
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
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

export function ContinueWriting({ isDarkMode, onToolComplete }: AIToolProps) {
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
        onToolComplete?.(data.content)
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
              className={`min-h-[300px] resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>

          <div>
            <Label htmlFor="direction">续写方向</Label>
            <Textarea
              id="direction"
              placeholder="描述希望续写的方向和重点..."
              value={formData.direction}
              onChange={(e) => setFormData({...formData, direction: e.target.value})}
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">原文内容</h4>
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <div className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed">
                    {originalContent}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">续写内容</h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
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

export function OutlineGenerator({ isDarkMode, onToolComplete }: AIToolProps) {
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
        onToolComplete?.(data.outline)
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
              className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
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
              className={`min-h-[100px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>

          <div>
            <Label htmlFor="style">写作风格</Label>
            <Textarea
              id="style"
              placeholder="描述希望的写作风格..."
              value={formData.style}
              onChange={(e) => setFormData({...formData, style: e.target.value})}
              className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
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
            className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
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
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
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