"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  BarChart2,
  Brain,
  Clock,
  MessageSquare,
  Plus,
  Share2,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* サイドバー */}
        <Sidebar />
        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* トップヘッダー */}
          <TopHeader />
          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* スキル分析 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>スキル分析</CardTitle>
                      <CardDescription>
                        AIがケア活動から特定した職業スキル
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      すべてのスキルを表示
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-rose-600 h-2.5 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        複数の責任を同時に管理した47の活動に基づく
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
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        迅速な判断を要する予期せぬ状況に関わる23の活動に基づく
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <MessageSquare
                              className="text-green-600"
                              size={16}
                            />
                          </div>
                          <h3 className="font-medium">
                            コミュニケーションスキル
                          </h3>
                        </div>
                        <span className="font-bold">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        様々な相手との明確なコミュニケーションを必要とする56の活動に基づく
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
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: "81%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        複雑なスケジュールとリソース管理を含む38の活動に基づく
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 最近の活動 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>最近の活動</CardTitle>
                      <CardDescription>最新のケア活動記録</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/activities">すべて表示</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        date: "今日, 9:30",
                        activity:
                          "仕事の会議の準備をしながら子供たちの朝の準備",
                        skills: ["マルチタスク", "時間管理"],
                        duration: "1時間15分",
                      },
                      {
                        date: "昨日, 16:15",
                        activity:
                          "高齢の親の医療予約のスケジュール調整を手伝う",
                        skills: ["コミュニケーション", "問題解決"],
                        duration: "45分",
                      },
                      {
                        date: "昨日, 19:30",
                        activity: "夕食の準備中に兄弟間の対立を解決",
                        skills: ["対立解決", "感情知性"],
                        duration: "30分",
                      },
                      {
                        date: "5月12日, 15:20",
                        activity: "家族の医療予約のための交通手段を調整",
                        skills: ["物流計画", "コミュニケーション"],
                        duration: "1時間",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500">{item.date}</p>
                            <p className="font-medium mt-1">{item.activity}</p>
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
                          </div>
                          <span className="text-xs font-medium bg-rose-100 text-rose-700 px-2 py-1 rounded whitespace-nowrap">
                            {item.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 職業への変換 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>職業スキルへの変換</CardTitle>
                <CardDescription>
                  ケア活動が職場スキルにどのように変換されるか
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-rose-100 p-2 rounded-full">
                        <BarChart2 className="text-rose-600" size={20} />
                      </div>
                      <h3 className="font-semibold">
                        マルチタスク → プロジェクト管理
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      複数のケア責任を同時に管理する能力は、職業環境でのプロジェクト管理スキルに直接変換されます。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">非常に高い</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Brain className="text-blue-600" size={20} />
                      </div>
                      <h3 className="font-semibold">危機管理 → 問題解決</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      予期せぬケア状況に対処した経験は、職場での課題に適用できる強力な問題解決能力を示しています。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">高い</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <MessageSquare className="text-green-600" size={20} />
                      </div>
                      <h3 className="font-semibold">
                        ケアのコミュニケーション → 顧客関係
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      様々な年齢の家族と効果的にコミュニケーションする能力は、優れた顧客・関係者とのコミュニケーションに変換されます。
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">職場での関連性:</span>
                        <span className="font-medium">非常に高い</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
