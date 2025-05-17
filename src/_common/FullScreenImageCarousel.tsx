"use client";

import { constants } from "buffer";
import Image from "next/image";
import { useCallback, useRef, useState, TouchEvent } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { cn } from "@/_utils/commons";

interface Props {
  images: string[];
  onClose: () => void;
}

export default function FullScreenImageCarousel({ images, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  // 터치 시작 위치 지정
  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 50; //px 이거 넘기면 다음으로 넘어감

    if (deltaX > threshold) {
      handleNext(); // 왼쪽 스와이프 → 다음 이미지
    } else if (deltaX < -threshold) {
      handlePrev(); // 오른쪽 스와이프 → 이전 이미지
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black"
    >
      <button
        className="absolute right-3 top-6"
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();

          onClose();
        }}
      >
        <CloseButton />
      </button>
      <div className="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 transform space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn("h-2 w-2 rounded-full transition-all duration-700", {
              "w-[34px] bg-white": currentIndex === index,
              "bg-gray-500": currentIndex !== index,
            })}
          />
        ))}
      </div>
      <section className="relative h-2/3 w-full max-w-[560px] overflow-hidden">
        {/* Image Wrapper */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function CloseButton() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3428 10.343L21.6565 21.6567"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M10.3435 21.6567L21.6572 10.343"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
