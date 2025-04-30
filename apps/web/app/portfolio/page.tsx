import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  BarChart2,
  Brain,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  Linkedin,
  MessageSquare,
  Settings,
  Share2,
  Users2,
} from "lucide-react"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* サイドバー */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-rose-600 text-white p-1.5 rounded-md">
                <Users2 size={18} />
              </div>
              <h1 className="font-bold text-gray-900">ケアポートフォリオ</h1>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <BarChart2 size={18} />
              ダッシュボード
            </Link>
            <Link
              href="/activities"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Calendar size={18} />
              活動記録
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-rose-50 text-rose-700"
            >
              <FileText size={18} />
              ポートフォリオ
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Settings size={18} />
              設定
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-xs font-medium">佐</span>
              </div>
              <div>
                <p className="text-sm font-medium">佐藤 花子</p>
                <p className="text-xs text-gray-500">親 & 介護者</p>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* トップヘッダー */}
          <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">あなたのポートフォリオ</h1>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit size={16} />
                  プロフィール編集
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 size={16} />
                  共有
                </Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2">
                  <Download size={16} />
                  エクスポート
                </Button>
              </div>
            </div>
          </header>

          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="preview">
              <TabsList className="mb-6">
                <TabsTrigger value="preview">ポートフォリオプレビュー</TabsTrigger>
                <TabsTrigger value="settings">ポートフォリオ設定</TabsTrigger>
                <TabsTrigger value="export">エクスポートオプション</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold">佐藤 花子</h3>
                          <p className="text-gray-600">専門的ケア経験ポートフォリオ</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download size={14} />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Linkedin size={14} />
                            LinkedIn
                          </Button>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-3">専門的概要</h4>
                        <p className="text-gray-700">
                          1,200時間以上の記録されたケア経験を持つ献身的な介護者で、マルチタスク、コミュニケーション、問題解決において優れたスキルを発揮します。複雑な状況を管理し、物流を調整し、プレッシャーの下で冷静さを保つ能力が証明されています。適応性、感情知性、効率的なリソース管理を重視する専門的な環境でこれらの転用可能なスキルを活かすことを目指しています。
                        </p>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-3">コアコンピテンシー</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-rose-100 p-1.5 rounded-full">
                                  <BarChart2 className="text-rose-600" size={16} />
                                </div>
                                <h3 className="font-medium">マルチタスク能力</h3>
                              </div>
                              <span className="font-bold">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              品質と細部への注意を維持しながら、複数の同時責任を一貫して管理。専門的な環境でのプロジェクト管理スキルに相当します。
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-1.5 rounded-full">
                                  <Brain className="text-blue-600" size={16} />
                                </div>
                                <h3 className="font-medium">問題解決 & 危機管理</h3>
                              </div>
                              <span className="font-bold">78%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              状況を迅速に分析し、プレッシャーの下で効果的な解決策を実施する強い能力。予期せぬケア状況の処理を通じて実証されています。
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-1.5 rounded-full">
                                  <MessageSquare className="text-green-600" size={16} />
                                </div>
                                <h3 className="font-medium">コミュニケーションスキル</h3>
                              </div>
                              <span className="font-bold">92%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              様々な相手やストレスの多い状況で効果的にコミュニケーションする優れた能力。顧客や関係者とのコミュニケーションに直接転用できます。
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-purple-100 p-1.5 rounded-full">
                                  <Clock className="text-purple-600" size={16} />
                                </div>
                                <h3 className="font-medium">時間管理 & 計画力</h3>
                              </div>
                              <span className="font-bold">81%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "81%" }}></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              複雑なスケジュールと物流を調整する能力が証明された優れた組織力。プロジェクト計画とリソース配分に適用可能です。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-3">ケア経験のハイライト</h4>
                        <div className="space-y-4">
                          <div className="border-l-4 border-rose-500 pl-4">
                            <h5 className="font-medium">危機管理</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              家庭の緊急事態を成功裏に管理し、迅速な思考と機転を実証。例：家族の日常を維持し、混乱を最小限に抑えながら緊急の配管修理を調整。
                            </p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium">対立解決</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              定期的に対人関係の対立を調停し、すべての当事者のニーズに対応するバランスの取れた解決策を見出しました。職場での意見の相違に適用可能な効果的なエスカレーション防止技術を開発。
                            </p>
                          </div>
                          <div className="border-l-4 border-green-500 pl-4">
                            <h5 className="font-medium">医療調整</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              複雑な医療予約を調整し、薬のスケジュールを正確に管理。複雑なシステムをナビゲートし、詳細な記録を維持する能力を実証。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-3">職業への変換</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-3">
                            このポートフォリオは、記録されたケア活動のAI分析を使用して作成され、それらを専門的な職場コンピテンシーに変換しています。表示されているスキルと指標は、ケア活動を通じて開発された実際の能力を表しています。
                          </p>
                          <p className="text-sm text-gray-700">
                            ケア活動が専門的スキルにどのように変換されるかについての詳細情報、またはこのポートフォリオについて詳しく話し合うには、佐藤花子（hanako.sato@example.com）までご連絡ください。
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>ポートフォリオ設定</CardTitle>
                    <CardDescription>雇用主に表示されるポートフォリオをカスタマイズ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* ポートフォリオ設定コンテンツがここに表示されます */}
                      <p>ポートフォリオ設定コンテンツがここに表示されます。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>エクスポートオプション</CardTitle>
                    <CardDescription>ポートフォリオを様々な形式でエクスポート</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* エクスポートオプションコンテンツがここに表示されます */}
                      <p>エクスポートオプションコンテンツがここに表示されます。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
