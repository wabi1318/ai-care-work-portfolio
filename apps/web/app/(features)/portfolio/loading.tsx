import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  BarChart2,
  Brain,
  Calendar,
  FileText,
  Settings,
  Users2,
} from "lucide-react";
import Link from "next/link";

export default function PortfolioLoading() {
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
              <h1 className="text-xl font-bold text-gray-900">
                あなたのポートフォリオ
              </h1>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </header>

          {/* メインコンテンツエリア（スクロール可能） */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* タブのスケルトン */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>

            {/* ポートフォリオプレビューのスケルトン */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
                  {/* ヘッダー部分のスケルトン */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-40" />
                      <Skeleton className="h-5 w-64" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>

                  {/* 専門的概要のスケルトン */}
                  <div className="mb-8">
                    <Skeleton className="h-6 w-40 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>

                  {/* コアコンピテンシーのスケルトン */}
                  <div className="mb-8">
                    <Skeleton className="h-6 w-48 mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />

                    <div className="space-y-4">
                      {/* スキル分析結果のスケルトン */}
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* スキル項目のスケルトン */}
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <Skeleton className="h-5 w-40" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Skeleton className="h-5 w-24" />
                                  <Skeleton className="h-5 w-32" />
                                </div>
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-5/6" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* 職業への変換のスケルトン */}
                  <div className="mb-8">
                    <Skeleton className="h-6 w-40 mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* フッターのスケルトン */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-40" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* コンテンツ領域内のローディングインジケーター */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* 背景の光る円 */}
            <div className="absolute w-12 h-12 bg-rose-50 rounded-full animate-pulse"></div>

            {/* 中央のアイコン */}
            <div className="relative z-20 animate-float">
              <Brain className="h-8 w-8 text-rose-600" />
            </div>

            {/* 回転する軌道 - 外側 */}
            <div className="absolute w-24 h-24 rounded-full border border-rose-200 opacity-70"></div>

            {/* 回転する粒子 - 外側 */}
            <div
              className="absolute w-3 h-3 bg-rose-500 rounded-full shadow-lg"
              style={{
                animation: "orbit 4s linear infinite",
                transformOrigin: "center",
                left: "calc(50% - 6px)",
                top: "0",
              }}
            ></div>

            {/* 回転する軌道 - 内側 */}
            <div className="absolute w-16 h-16 rounded-full border border-rose-200 opacity-70"></div>

            {/* 回転する粒子 - 内側 */}
            <div
              className="absolute w-2 h-2 bg-rose-300 rounded-full shadow-sm"
              style={{
                animation: "orbit 2s linear infinite",
                transformOrigin: "center",
                left: "calc(50% - 4px)",
                top: "calc(50% - 8px - 2px)",
              }}
            ></div>
          </div>

          {/* テキスト部分 */}
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-rose-600">
              ポートフォリオを読み込み中...
            </p>
          </div>

          {/* プログレスバー */}
          <div className="mt-3 w-48">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-600 h-1.5 rounded-full progress-bar-animation"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
