// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@workspace/ui/components/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
// import { Switch } from "@workspace/ui/components/switch"
// import { Label } from "@workspace/ui/components/label"
// import { ArrowLeft, Calendar, Check, Info } from "lucide-react"
// import { toast } from "@workspace/ui/components/use-toast"

// export default function CalendarSettings() {
//   const [isConnected, setIsConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [syncEnabled, setSyncEnabled] = useState(false)
//   const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true)
//   const [privacySettings, setPrivacySettings] = useState({
//     readOnly: true,
//     limitedAccess: true,
//     anonymizeData: true,
//   })

//   // Googleカレンダーとの連携
//   const handleConnectCalendar = async () => {
//     setIsLoading(true)

//     try {
//       // 実際のアプリケーションではここでOAuth認証を行います
//       // 今回はモックとして遅延を入れています
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       setIsConnected(true)
//       toast({
//         title: "カレンダーと連携しました",
//         description: "Googleカレンダーとの連携が完了しました。",
//       })
//     } catch (error) {
//       console.error("連携エラー:", error)
//       toast({
//         title: "連携に失敗しました",
//         description: "Googleカレンダーとの連携に失敗しました。もう一度お試しください。",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // カレンダー連携の解除
//   const handleDisconnectCalendar = async () => {
//     setIsLoading(true)

//     try {
//       // 実際のアプリケーションではここで連携解除処理を行います
//       // 今回はモックとして遅延を入れています
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       setIsConnected(false)
//       setSyncEnabled(false)
//       toast({
//         title: "連携を解除しました",
//         description: "Googleカレンダーとの連携を解除しました。",
//       })
//     } catch (error) {
//       console.error("連携解除エラー:", error)
//       toast({
//         title: "連携解除に失敗しました",
//         description: "Googleカレンダーとの連携解除に失敗しました。もう一度お試しください。",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // 設定の保存
//   const handleSaveSettings = () => {
//     toast({
//       title: "設定を保存しました",
//       description: "カレンダー連携の設定を保存しました。",
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="container mx-auto py-4 px-4 md:px-6">
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
//               <ArrowLeft size={20} />
//             </Link>
//             <h1 className="text-lg font-bold text-gray-900">カレンダー連携設定</h1>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto py-8 px-4 md:px-6">
//         <div className="max-w-2xl mx-auto">
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Googleカレンダー連携</CardTitle>
//               <CardDescription>カレンダーと連携して、予定からケア活動を自動的に抽出します。</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">カレンダー接続状態</h3>
//                     <p className="text-sm text-gray-500">{isConnected ? "Googleカレンダーと連携中" : "未接続"}</p>
//                   </div>
//                   {!isConnected ? (
//                     <Button
//                       onClick={handleConnectCalendar}
//                       disabled={isLoading}
//                       className="bg-rose-600 hover:bg-rose-700"
//                     >
//                       {isLoading ? "接続中..." : "接続する"}
//                     </Button>
//                   ) : (
//                     <Button variant="outline" onClick={handleDisconnectCalendar} disabled={isLoading}>
//                       {isLoading ? "解除中..." : "連携を解除"}
//                     </Button>
//                   )}
//                 </div>

//                 {isConnected && (
//                   <>
//                     <div className="space-y-4">
//                       <div className="flex items-center space-x-2">
//                         <Switch id="sync-enabled" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
//                         <Label htmlFor="sync-enabled">カレンダー同期を有効にする</Label>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="auto-suggest"
//                           checked={autoSuggestEnabled}
//                           onCheckedChange={setAutoSuggestEnabled}
//                         />
//                         <Label htmlFor="auto-suggest">ケア活動の自動提案を有効にする</Label>
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <h3 className="font-medium">プライバシー設定</h3>

//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="read-only"
//                           checked={privacySettings.readOnly}
//                           onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, readOnly: checked }))}
//                         />
//                         <Label htmlFor="read-only">読み取り専用アクセス（書き込みなし）</Label>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="limited-access"
//                           checked={privacySettings.limitedAccess}
//                           onCheckedChange={(checked) =>
//                             setPrivacySettings((prev) => ({ ...prev, limitedAccess: checked }))
//                           }
//                         />
//                         <Label htmlFor="limited-access">直近2週間の予定のみアクセス</Label>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="anonymize-data"
//                           checked={privacySettings.anonymizeData}
//                           onCheckedChange={(checked) =>
//                             setPrivacySettings((prev) => ({ ...prev, anonymizeData: checked }))
//                           }
//                         />
//                         <Label htmlFor="anonymize-data">分析時にデータを匿名化</Label>
//                       </div>
//                     </div>

//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
//                       <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
//                       <div>
//                         <p className="text-sm text-blue-800">プライバシーについて</p>
//                         <p className="text-xs text-blue-600 mt-1">
//                           カレンダーデータは安全に処理され、ケア活動の抽出にのみ使用されます。
//                           いつでも連携を解除できます。詳細は
//                           <Link href="#" className="underline">
//                             プライバシーポリシー
//                           </Link>
//                           をご覧ください。
//                         </p>
//                       </div>
//                     </div>

//                     <div className="pt-4 flex justify-end">
//                       <Button onClick={handleSaveSettings} className="bg-rose-600 hover:bg-rose-700">
//                         <Check className="mr-2 h-4 w-4" />
//                         設定を保存
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {isConnected && (
//             <div className="text-center">
//               <Button asChild className="bg-rose-600 hover:bg-rose-700">
//                 <Link href="/calendar/insights">
//                   <Calendar className="mr-2 h-4 w-4" />
//                   カレンダーからケア活動を抽出
//                 </Link>
//               </Button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }
