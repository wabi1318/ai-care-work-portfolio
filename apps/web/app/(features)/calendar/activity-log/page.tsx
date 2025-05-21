"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ActivityForm from "@/app/components/ActivityForm";
import TopHeader from "@/app/components/TopHeader";

export default function ActivityLog() {
  const router = useRouter();

  // フォーム送信成功時のハンドラー
  const handleSuccess = () => {
    // 活動一覧ページへリダイレクト
    router.push("/activities");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <TopHeader />

      {/* メインコンテンツ */}
      <main className="container mx-auto py-8 px-4 md:px-6">
        {/* 戻るリンク */}
        <div className="mb-6">
          <Link
            href="/activities"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
            <span>戻る</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">ケア活動を記録</h1>

          {/* ActivityFormコンポーネントを使用し、apiEndpointとonSuccessを渡す */}
          {/* 分析結果表示モーダルはActivityForm内部で処理 */}
          <ActivityForm
            apiEndpoint="/api/activities"
            onSuccess={handleSuccess}
          />
        </div>
      </main>
    </div>
  );
}
