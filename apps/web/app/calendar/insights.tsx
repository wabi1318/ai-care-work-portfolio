// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@workspace/ui/components/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
// import { Checkbox } from "@workspace/ui/components/checkbox"
// import { Label } from "@workspace/ui/components/label"
// import { ArrowLeft, Calendar, Check, Clock, Loader2, RefreshCw } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { toast } from "@workspace/ui/components/use-toast"
// import { ToastAction } from "@workspace/ui/components/toast"
// import { Badge } from "@workspace/ui/components/badge"

// // カレンダーイベントの型定義
// type CalendarEvent = {
//   id: string
//   summary: string
//   location?: string
//   description?: string
//   start: string
//   end: string
// }

// // ケア活動候補の型定義
// type CareCandidate = {
//   id: string
//   eventSummary: string
//   description: string
//   type: string
//   skills: string[]
//   duration: string
//   selected: boolean
// }

// export default function CalendarInsights() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [events, setEvents] = useState<CalendarEvent[]>([])
//   const [careCandidates, setCareCandidates] = useState<CareCandidate[]>([])

//   // カレンダーイベントの取得とケア活動の分析
//   useEffect(() => {
//     const fetchCalendarEvents = async () => {
//       setIsLoading(true)

//       try {
//         // 実際のアプリケーションではここでAPIリクエストを行います
//         // 今回はモックデータを使用します
//         await new Promise((resolve) => setTimeout(resolve, 1500))

//         // モックのカレンダーイベント
//         const mockEvents: CalendarEvent[] = [
//           {
//             id: "1",
//             summary: "母の通院付き添い",
//             location: "○○病院",
//             description: "定期検診の付き添い",
//             start: "2025-04-08T10:00:00",
//             end: "2025-04-08T11:30:00",
//           },
//           {
//             id: "2",
//             summary: "Web会議",
//             description: "プロジェクトの進捗確認",
//             start: "2025-04-08T13:00:00",
//             end: "2025-04-08T14:00:00",
//           },
//           {
//             id: "3",
//             summary: "保育園お迎え",
//             start: "2025-04-08T16:30:00",
//             end: "2025-04-08T17:00:00",
//           },
//           {
//             id: "4",
//             summary: "夕食の準備",
//             start: "2025-04-08T18:00:00",
//             end: "2025-04-08T19:00:00",
//           },
//           {
//             id: "5",
//             summary: "子どもの宿題サポート",
//             start: "2025-04-08T19:30:00",
//             end: "2025-04-08T20:30:00",
//           },
//         ]

//         setEvents(mockEvents)

//         // ケア活動候補の分析（実際のアプリケーションではAIによる分析を行います）
//         const mockCareCandidates: CareCandidate[] = [
//           {
//             id: "1",
//             eventSummary: "母の通院付き添い",
//             description: "高齢の親の医療サポート（通院の付き添い）",
//             type: "eldercare",
//             skills: ["忍耐力", "コミュニケーション", "問題解決"],
//             duration: "1時間30分",
//             selected: true,
//           },
//           {
//             id: "3",
//             eventSummary: "保育園お迎え",
//             description: "子どもの送迎サポート",
//             type: "childcare",
//             skills: ["時間管理", "段取り力"],
//             duration: "30分",
//             selected: true,
//           },
//           {
//             id: "4",
//             eventSummary: "夕食の準備",
//             description: "家族の食事準備",
//             type: "cooking",
//             skills: ["マルチタスク", "計画力"],
//             duration: "1時間",
//             selected: true,
//           },
//           {
//             id: "5",
//             eventSummary: "子どもの宿題サポート",
//             description: "子どもの学習支援",
//             type: "education",
//             skills: ["教育力", "忍耐力", "コミュニケーション"],
//             duration: "1時間",
//             selected: true,
//           },
//         ]

//         setCareCandidates(mockCareCandidates)
//       } catch (error) {
//         console.error("カレンダー取得エラー:", error)
//         toast({
//           title: "カレンダーの取得に失敗しました",
//           description: "もう一度お試しください。",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCalendarEvents()
//   }, [])

//   // 候補の選択状態を切り替え
//   const toggleCandidateSelection = (id: string) => {
//     setCareCandidates((prev) =>
//       prev.map((candidate) => (candidate.id === id ? { ...candidate, selected: !candidate.selected } : candidate)),
//     )
//   }

//   // 選択された候補を保存
//   const saveSelectedCandidates = async () => {
//     const selectedCandidates = careCandidates.filter((candidate) => candidate.selected)

//     if (selectedCandidates.length === 0) {
//       toast({
//         title: "選択されたケア活動がありません",
//         description: "少なくとも1つのケア活動を選択してください。",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // 実際のアプリケーションではここでAPIリクエストを行います
//       // 今回はモックとして遅延を入れています
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       toast({
//         title: "活動が記録されました",
//         description: `${selectedCandidates.length}件のケア活動が正常に記録されました。`,
//         action: <ToastAction altText="活動一覧を見る">活動一覧を見る</ToastAction>,
//       })

//       // 活動一覧ページにリダイレクト
//       router.push("/activities")
//     } catch (error) {
//       console.error("保存エラー:", error)
//       toast({
//         title: "保存に失敗しました",
//         description: "もう一度お試しください。",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // 活動タイプに応じた色を返す
//   const getTypeColor = (type: string) => {
//     const typeColors = {
//       childcare: "bg-blue-100 text-blue-800",
//       eldercare: "bg-purple-100 text-purple-800",
//       healthcare: "bg-green-100 text-green-800",
//       emotional: "bg-yellow-100 text-yellow-800",
//       household: "bg-gray-100 text-gray-800",
//       education: "bg-indigo-100 text-indigo-800",
//       cooking: "bg-orange-100 text-orange-800",
//       other: "bg-rose-100 text-rose-800",
//     }

//     return typeColors[type as keyof typeof typeColors] || typeColors.other
//   }

//   // 活動タイプの日本語名を返す
//   const getTypeName = (type: string) => {
//     const typeNames = {
//       childcare: "育児",
//       eldercare: "高齢者ケア",
//       healthcare: "医療サポート",
//       emotional: "感情的サポート",
//       household: "家事管理",
//       education: "教育サポート",
//       cooking: "料理",
//       other: "その他",
//     }

//     return typeNames[type as keyof typeof typeNames] || "その他"
//   }

//   // 日付をフォーマット
//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="container mx-auto py-4 px-4 md:px-6">
//           <div className="flex items-center gap-4">
//             <Link href="/calendar/settings" className="text-gray-500 hover:text-gray-700">
//               <ArrowLeft size={20} />
//             </Link>
//             <h1 className="text-lg font-bold text-gray-900">カレンダーからのケア活動抽出</h1>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto py-8 px-4 md:px-6">
//         <div className="max-w-2xl mx-auto">
//           <Card className="mb-6">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>予定表からのケア活動</CardTitle>
//                   <CardDescription>
//                     カレンダーから抽出されたケア活動候補です。確認して保存してください。
//                   </CardDescription>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-1"
//                   onClick={() => {
//                     setIsLoading(true)
//                     setTimeout(() => setIsLoading(false), 1500)
//                   }}
//                   disabled={isLoading}
//                 >
//                   <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
//                   更新
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex flex-col items-center justify-center py-12">
//                   <Loader2 className="h-8 w-8 text-rose-600 animate-spin mb-4" />
//                   <p className="text-gray-500">カレンダーからケア活動を抽出しています...</p>
//                 </div>
//               ) : careCandidates.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-700 mb-1">ケア活動が見つかりませんでした</h3>
//                   <p className="text-gray-500">
//                     カレンダーにケア活動と思われる予定がないか、まだ分析が完了していません。
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     {careCandidates.map((candidate) => (
//                       <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 relative">
//                         <div className="flex items-start gap-3">
//                           <Checkbox
//                             id={`candidate-${candidate.id}`}
//                             checked={candidate.selected}
//                             onCheckedChange={() => toggleCandidateSelection(candidate.id)}
//                             className="mt-1"
//                           />
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-2 mb-2">
//                               <Badge className={getTypeColor(candidate.type)}>{getTypeName(candidate.type)}</Badge>
//                               <span className="text-sm text-gray-500">
//                                 🕙 {formatTime(events.find((e) => e.id === candidate.id)?.start || "")}
//                               </span>
//                             </div>

//                             <Label htmlFor={`candidate-${candidate.id}`} className="font-medium cursor-pointer">
//                               {candidate.eventSummary}
//                             </Label>

//                             <p className="text-sm text-gray-600 mt-1">{candidate.description}</p>

//                             <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
//                               <Clock size={14} />
//                               <span>{candidate.duration}</span>
//                             </div>

//                             <div className="flex flex-wrap gap-1 mt-2">
//                               {candidate.skills.map((skill, idx) => (
//                                 <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
//                                   {skill}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="pt-4 flex justify-end">
//                     <div className="text-xs text-gray-500 flex items-center mr-auto">
//                       <Calendar size={12} className="mr-1" />
//                       カレンダーから抽出
//                     </div>
//                     <Button
//                       className="bg-rose-600 hover:bg-rose-700"
//                       onClick={saveSelectedCandidates}
//                       disabled={isSubmitting || careCandidates.filter((c) => c.selected).length === 0}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           保存中...
//                         </>
//                       ) : (
//                         <>
//                           <Check className="mr-2 h-4 w-4" />
//                           選択した活動を保存
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <div className="mt-6 flex justify-center">
//             <div className="flex items-center gap-4">
//               <Button variant="outline" className="flex items-center gap-2" asChild>
//                 <Link href="/activity-log">手動で記録</Link>
//               </Button>
//               <Button variant="outline" className="flex items-center gap-2" asChild>
//                 <Link href="/ai-chat">AIと会話して記録</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
