import { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Swiper as SwiperType } from "swiper";

interface SwipeableTabViewProps {
  activeIndex: number;
  onTabChange?: (index: number) => void;
  children: ReactNode[];
  className?: string;
}

export default function SwipeableTabView({
  activeIndex,
  onTabChange,
  children,
}: SwipeableTabViewProps) {
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const swiperRef = useRef<SwiperType | null>(null);
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Update container height based on active tab
  const updateContainerHeight = useCallback((index: number) => {
    const activeTabHeight = tabRefs.current[index]?.scrollHeight;
    if (activeTabHeight) {
      setContainerHeight(`${activeTabHeight}px`);
    }
  }, []);

  // Set up references for tab elements
  useEffect(() => {
    tabRefs.current = Array(children.length).fill(null);
  }, [children.length]);

  // Sync external activeIndex with Swiper and update height
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.activeIndex !== activeIndex) {
      swiperRef.current.slideTo(activeIndex, 300);
    }

    if (tabRefs.current[activeIndex]) {
      updateContainerHeight(activeIndex);
    }
  }, [activeIndex, updateContainerHeight]);

  // Handle slide changes
  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const newIndex = swiper.activeIndex;
      if (onTabChange && newIndex !== activeIndex) {
        onTabChange(newIndex);
      }
    },
    [activeIndex, onTabChange],
  );

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const handleTabRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      tabRefs.current[index] = el;
      if (index === activeIndex && el) {
        updateContainerHeight(index);
      }
    },
    [activeIndex, updateContainerHeight],
  );

  return (
    <div
      className={`relative w-full overflow-hidden`}
      style={{
        height: containerHeight,
        transition: "height 0.3s ease",
      }}
    >
      <Swiper
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        initialSlide={activeIndex}
        touchStartPreventDefault={false}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            <div
              ref={(el) => handleTabRef(el, index)}
              className="min-w-full touch-auto overflow-y-auto overscroll-contain"
              style={{
                scrollBehavior: "smooth",
                display: "block",
                height: "100%",
              }}
              data-tab-index={index}
            >
              {child}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
