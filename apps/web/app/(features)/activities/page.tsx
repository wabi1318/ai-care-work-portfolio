import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Brain,
  Clock,
  Filter,
  Search,
  MessageSquare,
  Edit,
  CalendarIcon,
} from "lucide-react";

import Sidebar from "@/app/components/Sidebar";
import TopHeader from "@/app/components/TopHeader";

export default function Activities() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* サイドバー */}
        <Sidebar />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* トップヘッダー */}
          <TopHeader
            title="活動一覧"
            showBackButton={false}
            showActionButton={true}
          />
          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <Tabs defaultValue="all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <TabsList>
                    <TabsTrigger value="all">すべての活動</TabsTrigger>
                    <TabsTrigger value="childcare">育児</TabsTrigger>
                    <TabsTrigger value="eldercare">高齢者ケア</TabsTrigger>
                    <TabsTrigger value="household">家事</TabsTrigger>
                  </TabsList>

                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="活動を検索..."
                        className="pl-8 h-9 w-[200px] sm:w-[300px]"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      フィルター
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="space-y-4">
                    {[
                      {
                        date: "今日, 9:30",
                        activity:
                          "仕事の会議の準備をしながら子供たちの朝の準備",
                        category: "育児",
                        skills: ["マルチタスク", "時間管理"],
                        duration: "1時間15分",
                        skillsIdentified: 4,
                      },
                      {
                        date: "昨日, 16:15",
                        activity:
                          "高齢の親の医療予約のスケジュール調整を手伝う",
                        category: "高齢者ケア",
                        skills: ["コミュニケーション", "問題解決", "忍耐力"],
                        duration: "45分",
                        skillsIdentified: 3,
                      },
                      {
                        date: "昨日, 19:30",
                        activity: "夕食の準備中に兄弟間の対立を解決",
                        category: "育児",
                        skills: ["対立解決", "感情知性", "コミュニケーション"],
                        duration: "30分",
                        skillsIdentified: 3,
                      },
                      {
                        date: "5月12日, 15:20",
                        activity: "家族の医療予約のための交通手段を調整",
                        category: "高齢者ケア",
                        skills: ["物流計画", "コミュニケーション"],
                        duration: "1時間",
                        skillsIdentified: 2,
                      },
                      {
                        date: "5月11日, 8:00",
                        activity: "給湯器が壊れた時の家庭の危機管理",
                        category: "家事",
                        skills: ["危機管理", "問題解決", "リソース管理"],
                        duration: "2時間30分",
                        skillsIdentified: 5,
                      },
                      {
                        date: "5月10日, 18:45",
                        activity: "子供の複雑な宿題を手伝う",
                        category: "育児",
                        skills: ["教育", "忍耐力", "専門知識"],
                        duration: "1時間15分",
                        skillsIdentified: 3,
                      },
                      {
                        date: "5月9日, 12:30",
                        activity: "高齢の親の薬のスケジュールを整理",
                        category: "高齢者ケア",
                        skills: ["組織力", "細部への注意", "医療知識"],
                        duration: "45分",
                        skillsIdentified: 3,
                      },
                      {
                        date: "5月8日, 7:00",
                        activity:
                          "子供たちの監督をしながら一週間分の食事を準備",
                        category: "家事",
                        skills: ["マルチタスク", "計画力", "時間管理"],
                        duration: "3時間",
                        skillsIdentified: 4,
                      },
                    ].map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full">
                                  {item.category}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.date}
                                </span>
                              </div>
                              <p className="font-medium mb-2">
                                {item.activity}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-3">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    index % 3 === 0
                                      ? "bg-blue-50 text-blue-700"
                                      : index % 3 === 1
                                        ? "bg-purple-50 text-purple-700"
                                        : "bg-green-50 text-green-700"
                                  }`}
                                >
                                  {index % 3 === 0 ? (
                                    <>
                                      <CalendarIcon size={10} />
                                      カレンダーから追加
                                    </>
                                  ) : index % 3 === 1 ? (
                                    <>
                                      <MessageSquare size={10} />
                                      AIチャットから追加
                                    </>
                                  ) : (
                                    <>
                                      <Edit size={10} />
                                      手動で追加
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock size={14} />
                                {item.duration}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-blue-600">
                                <Brain size={14} />
                                {item.skillsIdentified}つのスキルを特定
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 他のタブコンテンツは同様だがフィルタリングされる */}
                <TabsContent value="childcare" className="mt-0">
                  <div className="space-y-4">
                    {/* フィルタリングされた育児活動 */}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
