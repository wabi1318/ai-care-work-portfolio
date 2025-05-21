"use client";

import Link from "next/link";
import { BarChart2, Calendar, FileText, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path);
  };

  return (
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
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
            isActive("/dashboard")
              ? "bg-rose-50 text-rose-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BarChart2 size={18} />
          ダッシュボード
        </Link>
        <Link
          href="/activities"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
            isActive("/activities")
              ? "bg-rose-50 text-rose-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Calendar size={18} />
          活動一覧
        </Link>
        <Link
          href="/portfolio"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
            isActive("/portfolio")
              ? "bg-rose-50 text-rose-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileText size={18} />
          ポートフォリオ
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <span className="text-xs font-medium">佐</span>
          </div>
          <div>
            <p className="text-sm font-medium">佐藤 花子</p>
          </div>
        </div>
      </div>
    </div>
  );
}
