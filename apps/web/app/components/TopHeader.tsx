import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  Plus,
  Edit,
  MessageSquare,
  Calendar,
  ArrowLeft,
  CheckSquare,
} from "lucide-react";

interface TopHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  showActionButton?: boolean;
}

export default function TopHeader({
  title,
  description,
  showBackButton = false,
  showActionButton = true,
}: TopHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        {showActionButton && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
              >
                <Plus size={16} />
                新しい活動を記録
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href="/activity-log"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit size={16} />
                  手動で記録
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link
                  href="/ai-chat"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  AIと会話して記録
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link
                  href="/calendar/insights"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={16} />
                  カレンダーから記録
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/tasks/insights"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CheckSquare size={16} />
                  タスクから記録
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
