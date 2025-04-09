import React, { ReactNode, useEffect, useRef, useState } from "react";
interface SwipeableTabBarProps {
  activeTabIndex: number;
  children: ReactNode[];
  onTabChange: (index: number) => void;
}

export default function SwipeableTabBar({
  activeTabIndex,
  children,
  onTabChange,
}: SwipeableTabBarProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isTastingNoteActive = activeTabIndex === 0;

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
    <div className="relative w-full">
      <div className="flex flex-row overflow-x-auto scrollbar-hide">
        {children.map((child, index) => (
          <button
            key={index}
            className={`flex h-11 w-1/2 flex-row items-center justify-center transition-all duration-200 ${
              index === activeTabIndex ? tabStyles.active : tabStyles.inactive
            }`}
            onClick={() => onTabChange(index)}
          >
            {child}
          </button>
        ))}
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
