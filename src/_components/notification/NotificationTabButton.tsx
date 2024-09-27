"use client";

import { cn } from "@/_utils/commons";
import { useMemo } from "react";

interface NotificationTabButtonProps {
  onTabClick: (tabName: string) => void;
  selectedTab: string;
}

export default function NotificationTabButton({
  onTabClick,
  selectedTab,
}: NotificationTabButtonProps) {
  const tabItems = useMemo(
    () => ["전체", "공유공간", "전통주 추천", "공지사항"],
    [],
  );

  return (
    <div className="flex items-start justify-start gap-4 border-b border-slate-200 px-4">
      {tabItems.map((tab) => (
        <button
          key={tab}
          className={cn(
            "flex items-center justify-center py-[0.54rem] font-medium text-cool-grayscale-500",
            selectedTab === tab && "border-b-2 border-black text-black",
          )}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
