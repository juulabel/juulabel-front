import React, { useEffect, useRef } from "react";

interface UserProfileTabsProps {
  isTastingNoteActive: boolean;
  tastingNoteCount: number;
  dailyLifeCount: number;
  onTabChange: (isTastingNote: boolean) => void;
}

export default function UserProfileTabs({
  isTastingNoteActive,
  tastingNoteCount = 0,
  dailyLifeCount = 0,
  onTabChange,
}: UserProfileTabsProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  // Update indicator position when active tab changes
  useEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(${isTastingNoteActive ? 0 : 100}%)`;
    }
  }, [isTastingNoteActive]);

  const tabStyles = {
    active: "font-semibold text-base text-black",
    inactive: "font-normal text-cool-grayscale-600",
  };

  return (
    <div className="relative w-full pt-4">
      <div className="flex flex-row overflow-x-auto scrollbar-hide">
        <button
          className={`flex h-11 w-1/2 flex-row items-center justify-center transition-all duration-200 ${
            isTastingNoteActive ? tabStyles.active : tabStyles.inactive
          }`}
          onClick={() => onTabChange(true)}
        >
          <p>시음노트</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {tastingNoteCount}개
          </p>
        </button>
        <button
          className={`flex h-11 w-1/2 flex-row items-center justify-center transition-all duration-200 ${
            !isTastingNoteActive ? tabStyles.active : tabStyles.inactive
          }`}
          onClick={() => onTabChange(false)}
        >
          <p>일상생활</p>
          <p className="ml-1 text-sm text-cool-grayscale-600">
            {dailyLifeCount}개
          </p>
        </button>
      </div>
      
      {/* Bottom border for inactive tabs */}
      <div className="absolute bottom-0 w-full border-b border-cool-grayscale-300"></div>
      
      {/* Animated indicator for active tab */}
      <div 
        ref={indicatorRef}
        className="absolute bottom-0 h-0.5 w-1/2 bg-black transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${isTastingNoteActive ? 0 : 100}%)` }}
      ></div>
    </div>
  );
}
