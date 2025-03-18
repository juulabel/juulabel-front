import {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import React from "react";

interface SwipeableTabViewProps {
  activeIndex: number;
  onTabChange?: (index: number) => void;
  children: ReactNode[];
  observerRef?: RefObject<HTMLDivElement>;
  className?: string;
}

interface TouchData {
  isTouching: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startOffset: number;
  isHorizontalSwipe: boolean;
  hasDecidedDirection: boolean;
  initialTabState: number;
  tabScrollPositions: Record<number, number>;
  preventNextClick: boolean;
  velocity: number;
  lastMoveTime: number;
  isSwitchingTabs: boolean;
}

export default function SwipeableTabView({
  activeIndex,
  onTabChange,
  children,
  observerRef,
  className = "",
}: SwipeableTabViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const touchData = useRef<TouchData>({
    isTouching: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startOffset: 0,
    isHorizontalSwipe: false,
    hasDecidedDirection: false,
    initialTabState: 0,
    tabScrollPositions: {},
    preventNextClick: false,
    velocity: 0,
    lastMoveTime: 0,
    isSwitchingTabs: false,
  });
  const [currentOffset, setCurrentOffset] = useState(-100 * activeIndex);
  const animationRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>("auto");

  // Update container height based on active tab
  useEffect(() => {
    if (tabRefs.current[activeIndex]) {
      const activeTabHeight = tabRefs.current[activeIndex]?.scrollHeight;
      if (activeTabHeight) {
        setContainerHeight(`${activeTabHeight}px`);
      }
    }
  }, [activeIndex, children]);

  // Smooth transition to target offset using requestAnimationFrame
  const smoothScrollTo = useCallback(
    (targetOffset: number, duration: number = 250) => {
      const startOffset = currentOffset;
      const distance = targetOffset - startOffset;
      const startTime = performance.now();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // More robust animation function with better completion handling
      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Improved easing function for smoother animation
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const easedProgress = easeOutQuart(progress);

        const newOffset = startOffset + distance * easedProgress;
        setCurrentOffset(newOffset);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateScroll);
        } else {
          // Ensure we land exactly on the target offset
          setCurrentOffset(targetOffset);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animateScroll);
    },
    [currentOffset],
  );

  // Smooth scroll for vertical position
  const smoothScrollVertical = useCallback(
    (element: HTMLElement, targetY: number, duration: number = 300) => {
      const startY = element.scrollTop;
      const distance = targetY - startY;
      const startTime = performance.now();

      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      const animateVerticalScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smoother animation
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        const newY = startY + distance * easedProgress;
        element.scrollTop = newY;

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(
            animateVerticalScroll,
          );
        } else {
          scrollAnimationRef.current = null;
        }
      };

      scrollAnimationRef.current = requestAnimationFrame(animateVerticalScroll);
    },
    [],
  );

  useEffect(() => {
    if (!touchData.current.isTouching) {
      smoothScrollTo(-100 * activeIndex);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [activeIndex, smoothScrollTo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tabRefs.current.length) {
        const activeTab = tabRefs.current[activeIndex];
        if (activeTab) {
          // Don't auto-scroll to saved position - maintain current position
          // Only restore saved position when returning to a previously viewed tab
          if (touchData.current.tabScrollPositions[activeIndex] !== undefined) {
            smoothScrollVertical(
              activeTab,
              touchData.current.tabScrollPositions[activeIndex],
              300,
            );
          }

          // Remove automatic window scrolling - let user control vertical position
          // We'll only do this when user explicitly taps a tab, not during swipes
          if (touchData.current.isSwitchingTabs) {
            touchData.current.isSwitchingTabs = false;
          }
          
          // Update height when tab changes
          const activeTabHeight = activeTab.scrollHeight;
          if (activeTabHeight) {
            setContainerHeight(`${activeTabHeight}px`);
          }
        }
      }
    }, 100); // Slightly longer delay to allow horizontal transition to complete first
    return () => clearTimeout(timer);
  }, [activeIndex, smoothScrollVertical]);

  const saveScrollPositions = useCallback(() => {
    tabRefs.current.forEach((tab, index) => {
      if (tab) touchData.current.tabScrollPositions[index] = tab.scrollTop;
    });
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleGlobalTouchStart = (e: TouchEvent) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }

      saveScrollPositions();
      touchData.current = {
        ...touchData.current,
        isTouching: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
        startOffset: currentOffset,
        isHorizontalSwipe: false,
        hasDecidedDirection: false,
        initialTabState: activeIndex,
        preventNextClick: false,
        tabScrollPositions: { ...touchData.current.tabScrollPositions },
        velocity: 0,
        lastMoveTime: Date.now(),
        isSwitchingTabs: false,
      };
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const touch = touchData.current;
      if (!touch.isTouching) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touch.startX;
      const diffY = currentY - touch.startY;

      // Calculate velocity for momentum scrolling
      const now = Date.now();
      const elapsed = now - touch.lastMoveTime;
      const deltaX = currentX - touch.lastX;
      touch.velocity = elapsed > 0 ? deltaX / elapsed : 0;
      touch.lastMoveTime = now;

      touch.lastX = currentX;
      touch.lastY = currentY;

      if (!touch.hasDecidedDirection) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          touch.isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.1;
          touch.hasDecidedDirection = true;
        }
        return;
      }

      if (touch.isHorizontalSwipe) {
        e.preventDefault();
        const containerWidth = container.offsetWidth;
        const percentMoved = (diffX / containerWidth) * 100;
        const maxOffset = -100 * (children.length - 1);

        // Add resistance when reaching edges
        let newOffset = touch.startOffset + percentMoved * 0.8;
        if (newOffset > 0) {
          newOffset = newOffset * 0.5; // More resistance when pulling past first tab
        } else if (newOffset < maxOffset) {
          newOffset = maxOffset + (newOffset - maxOffset) * 0.5; // More resistance when pulling past last tab
        }

        newOffset = Math.max(maxOffset - 50, Math.min(50, newOffset));
        setCurrentOffset(newOffset);
        touch.preventNextClick = Math.abs(diffX) > 10;
      }
    };

    const handleGlobalTouchEnd = () => {
      const touch = touchData.current;
      if (!touch.isTouching) {
        return;
      }

      touch.isTouching = false;

      if (touch.isHorizontalSwipe) {
        const hasMoved = Math.abs(currentOffset - touch.startOffset) > 20;
        const velocity = touch.velocity;
        const isSignificantVelocity = Math.abs(velocity) > 0.5;

        if (hasMoved || isSignificantVelocity) {
          let targetIndex;

          if (isSignificantVelocity) {
            // More decisive velocity-based decision
            targetIndex =
              velocity > 0
                ? Math.max(0, activeIndex - 1)
                : Math.min(children.length - 1, activeIndex + 1);
          } else {
            // More clear threshold for position-based decision
            // If we've moved more than 40% of the way, switch tabs
            const currentPosition = Math.abs(currentOffset);
            const currentTab = Math.floor(currentPosition / 100);
            const progress = (currentPosition % 100) / 100;

            targetIndex = progress > 0.4 ? currentTab + 1 : currentTab;

            // Ensure we're within bounds
            targetIndex = Math.min(
              children.length - 1,
              Math.max(0, targetIndex),
            );
          }

          // Ensure targetIndex is different from current to prevent sticking between tabs
          if (targetIndex !== activeIndex && onTabChange) {
            // Force the animation to complete by setting the offset immediately
            setCurrentOffset(-100 * targetIndex);
            // Then call the tab change handler
            onTabChange(targetIndex);
          } else {
            // More forceful animation back to current tab
            smoothScrollTo(-100 * activeIndex, 200);
          }
        } else {
          // Small movement, animate back to current tab more quickly
          smoothScrollTo(-100 * activeIndex, 200);
        }
      }

      touch.isHorizontalSwipe = false;
      touch.hasDecidedDirection = false;
    };

    const handleGlobalTouchCancel = () => {
      const touch = touchData.current;
      touch.isTouching = false;
      touch.isHorizontalSwipe = false;
      touch.hasDecidedDirection = false;
      smoothScrollTo(-100 * activeIndex, 250);
    };

    const handleClick = (e: MouseEvent) => {
      if (touchData.current.preventNextClick) {
        e.stopPropagation();
        e.preventDefault();
        touchData.current.preventNextClick = false;
      }
    };

    container.addEventListener("touchstart", handleGlobalTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleGlobalTouchEnd);
    container.addEventListener("touchcancel", handleGlobalTouchCancel);
    container.addEventListener("click", handleClick, { capture: true });

    return () => {
      container.removeEventListener("touchstart", handleGlobalTouchStart);
      container.removeEventListener("touchmove", handleGlobalTouchMove);
      container.removeEventListener("touchend", handleGlobalTouchEnd);
      container.removeEventListener("touchcancel", handleGlobalTouchCancel);
      container.removeEventListener("click", handleClick, { capture: true });

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [
    currentOffset,
    activeIndex,
    onTabChange,
    children.length,
    saveScrollPositions,
    smoothScrollTo,
    smoothScrollVertical,
  ]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, children.length);
    while (tabRefs.current.length < children.length) tabRefs.current.push(null);
  }, [children.length]);

  useEffect(() => {
    if (observerRef?.current && tabRefs.current[activeIndex]) {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab && !activeTab.contains(observerRef.current)) {
        activeTab.appendChild(observerRef.current);
      }
    }
  }, [observerRef, activeIndex]);

  // Add a safety mechanism to ensure we're always aligned with activeIndex
  useEffect(() => {
    // This extra useEffect ensures we're always aligned with the activeIndex
    const targetOffset = -100 * activeIndex;

    // If we're not within 0.5% of the target, force alignment
    if (Math.abs(currentOffset - targetOffset) > 0.5) {
      // Only force immediate alignment if not currently animating
      if (!animationRef.current && !touchData.current.isTouching) {
        setCurrentOffset(targetOffset);
      }
    }
  }, [activeIndex, currentOffset]);

  const isTransitioning =
    !touchData.current.isTouching || touchData.current.hasDecidedDirection;

  return (
    <div
      className={`relative w-full touch-none overflow-hidden ${className}`}
      ref={contentRef}
      style={{ height: containerHeight, transition: "height 0.3s ease" }}
    >
      <div
        className="flex w-full will-change-transform"
        style={{
          transform: `translateX(${currentOffset}%)`,
          transition:
            isTransitioning && !animationRef.current
              ? "transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)"
              : "none",
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
              // Update height when the active tab is mounted
              if (index === activeIndex && el) {
                console.log(el.scrollHeight);
                
                setContainerHeight(`${el.scrollHeight}px`);
              }
            }}
            className="min-w-full touch-auto overflow-y-auto overscroll-contain"
            style={{ 
              scrollBehavior: "smooth",
              display: "block" // Ensure all tabs are rendered for height calculation
            }}
            data-tab-index={index}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
