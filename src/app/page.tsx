'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  PenTool,
  Download,
  Sparkles,
  ArrowRight,
  FileText,
  Users,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const coreFeatures = [
    {
      icon: PenTool,
      title: '写作工作台',
      description: '简洁优雅的编辑器，专注创作本身，支持章节管理和实时保存'
    },
    {
      icon: Users,
      title: '角色管理',
      description: '创建丰富的人物档案，记录关系、动机与成长轨迹'
    },
    {
      icon: FileText,
      title: '大纲规划',
      description: '结构化故事情节，把握叙事节奏，让故事层层推进'
    },
    {
      icon: Settings,
      title: '世界观设定',
      description: '构建完整的世界背景，设定历史、地理与文化规则'
    }
  ]

  const tools = [
    {
      name: '角色生成',
      description: '智能生成人物设定',
      icon: Users
    },
    {
      name: '世界构建',
      description: '完善世界观设定',
      icon: Settings
    },
    {
      name: '大纲生成',
      description: '智能故事结构规划',
      icon: FileText
    },
    {
      name: '智能续写',
      description: 'AI辅助内容创作',
      icon: PenTool
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrollY > 10 ? "glass-effect border-b border-border" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Lenova Write
              </span>
            </div>

            <div className="flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">功能</a>
              <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">工具</a>
              <Link href="/app">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-8 h-11 rounded-xl font-medium">
                  开始写作
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - split layout */}
      <section className="pt-36 pb-28 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="badge-pill mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              小而美的免费创作空间
            </Badge>

            <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 leading-[1.05] text-foreground tracking-tight">
              专注于
              <span className="block mt-1 text-primary">写作本身</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              无需登录，打开即写。简洁的界面设计、完整的创作工具与沉浸式体验，让你专注于故事的每一个字。
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app">
                <Button size="lg" className="text-base px-8 h-12 rounded-xl font-medium bg-primary hover:bg-primary/90">
                  <PenTool className="w-5 h-5 mr-2" />
                  立即开始创作
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl font-medium border-2">
                了解更多
              </Button>
            </div>
          </div>

          {/* right preview card */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-border p-6 bg-card">
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="h-24 rounded-xl border border-border bg-secondary/40" />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-2 w-28 rounded-full bg-secondary" />
                <div className="h-2 w-16 rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-foreground tracking-tight">
              精心设计的创作工具
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              从构思到完稿，每个功能都为写作者量身打造
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="card-surface hover-lift transition-all duration-300 rounded-2xl border border-border/80">
                <CardContent className="p-7 text-center">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section id="tools" className="py-32 px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-foreground tracking-tight">
              AI 辅助创作
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              智能工具箱，为你的创作提供灵感和效率
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <div key={index} className="bg-card rounded-2xl border border-border p-8 hover:border-foreground/20 transition-all duration-300">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <tool.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">{tool.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-primary-foreground mb-8 tracking-tight">
            准备好开始创作了吗？
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12">
            无需注册，永久免费，你的故事从这里开始
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-base px-10 h-14 rounded-xl font-medium">
              <PenTool className="w-5 h-5 mr-2" />
              免费开始写作
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-background" />
              </div>
              <span className="text-base font-semibold text-foreground">Lenova Write</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Lenova Write. 为故事创作者打造。
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}