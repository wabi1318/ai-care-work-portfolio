"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { ArrowLeft, Brain, Send, Plus, Calendar, Clock, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@workspace/ui/components/use-toast"
import { ToastAction } from "@workspace/ui/components/toast"
import { Badge } from "@workspace/ui/components/badge"

// メッセージの型定義
type Message = {
  role: "user" | "assistant"
  content: string
}

// 抽出されたケア活動の型定義
type CareActivity = {
  description: string
  type: string
  skills: string[]
  duration?: string
}

export default function AIChat() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "こんにちは！今日はどんな一日でしたか？何か話したいことがあれば、お聞かせください。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [extractedActivities, setExtractedActivities] = useState<CareActivity[]>([])
  const [showExtractedActivities, setShowExtractedActivities] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // メッセージが追加されたときに自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // メッセージを送信
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // ユーザーメッセージを追加
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // APIリクエスト
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました")
      }

      const data = await response.json()

      // AIの応答を追加
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])

      // 抽出されたケア活動があれば保存
      if (data.careActivities && data.careActivities.length > 0) {
        setExtractedActivities(data.careActivities)
        setShowExtractedActivities(true)
      }
    } catch (error) {
      console.error("エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: "メッセージの送信中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 抽出された活動を保存
  const saveExtractedActivities = async () => {
    setIsLoading(true)

    try {
      // 実際のアプリケーションではここでAPIリクエストを行います
      // 今回はモックとして遅延を入れています
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "活動が記録されました",
        description: `${extractedActivities.length}件のケア活動が正常に記録されました。`,
        action: <ToastAction altText="活動一覧を見る">活動一覧を見る</ToastAction>,
      })

      // 活動一覧ページにリダイレクト
      router.push("/activities")
    } catch (error) {
      console.error("保存エラー:", error)
      toast({
        title: "保存に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 活動タイプに応じた色を返す
  const getTypeColor = (type: string) => {
    const typeColors = {
      childcare: "bg-blue-100 text-blue-800",
      eldercare: "bg-purple-100 text-purple-800",
      healthcare: "bg-green-100 text-green-800",
      emotional: "bg-yellow-100 text-yellow-800",
      household: "bg-gray-100 text-gray-800",
      education: "bg-indigo-100 text-indigo-800",
      cooking: "bg-orange-100 text-orange-800",
      other: "bg-rose-100 text-rose-800",
    }

    return typeColors[type as keyof typeof typeColors] || typeColors.other
  }

  // 活動タイプの日本語名を返す
  const getTypeName = (type: string) => {
    const typeNames = {
      childcare: "育児",
      eldercare: "高齢者ケア",
      healthcare: "医療サポート",
      emotional: "感情的サポート",
      household: "家事管理",
      education: "教育サポート",
      cooking: "料理",
      other: "その他",
    }

    return typeNames[type as keyof typeof typeNames] || "その他"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">今日のこと、話しませんか？</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {!showExtractedActivities ? (
            <Card>
              <CardHeader>
                <CardTitle>AIとの会話</CardTitle>
                <CardDescription>今日あったことを自由に話してください。AIがケア活動を見つけ出します。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {/* チャットメッセージ表示エリア */}
                  <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto p-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <Brain size={16} />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.role === "user" ? "bg-rose-600 text-white ml-auto" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <span className="text-xs font-medium">佐</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />

                    {/* 入力中表示 */}
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <Brain size={16} />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 入力フォーム */}
                  <div className="flex items-end gap-2 mt-2">
                    <Textarea
                      placeholder="メッセージを入力..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="min-h-[80px] resize-none"
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="bg-rose-600 hover:bg-rose-700 h-10 w-10"
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>抽出されたケア活動</CardTitle>
                <CardDescription>会話から以下のケア活動が見つかりました。確認して保存してください。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {extractedActivities.map((activity, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="mb-3">
                          <Badge className={getTypeColor(activity.type)}>{getTypeName(activity.type)}</Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h3 className="font-medium">{activity.description}</h3>
                            {activity.duration && (
                              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                <Clock size={14} />
                                <span>{activity.duration}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {activity.skills.map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setShowExtractedActivities(false)}>
                      会話に戻る
                    </Button>
                    <div className="text-xs text-gray-500 flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      AIチャットから抽出
                    </div>
                    <Button
                      type="button"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={saveExtractedActivities}
                      disabled={isLoading}
                    >
                      {isLoading ? "保存中..." : "活動を保存"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/activity-log">
                  <Plus size={16} />
                  手動で記録
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/calendar/insights">
                  <Calendar size={16} />
                  カレンダーから抽出
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
