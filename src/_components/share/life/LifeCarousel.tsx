"use client";
import "swiper/css";
import "swiper/css/pagination";
import { useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper/modules";
import Image from "next/image";

interface ILifeCarousel {
  imageUrlList: string[];
}

export default function LifeCarousel({ imageUrlList }: ILifeCarousel) {
  const pagination = {
    el: ".swiper-custom-pagination",
    clickable: true,
    bulletClass: "w-2 h-2 inline-block bg-cool-grayscale-400 rounded-full",
    bulletActiveClass:
      "!bg-secondary w-[34px] transition-colors duration-700 ease-out",
    renderBullet: function (index: number, className: string) {
      return '<div class="' + className + '">' + "</div>";
    },
  };

  return (
    <>
      {imageUrlList.length !== 0 ? (
        <>
          <Swiper
            resistanceRatio={0}
            pagination={pagination}
            modules={[Pagination]}
            className="mySwiper relative aspect-square overflow-hidden rounded-xl py-8"
          >
            {imageUrlList.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <Image
                  priority={index === 0}
                  src={imageUrl}
                  alt="일상생활 글 이미지"
                  sizes="100vw"
                  fill
                  className="object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-custom-pagination flex h-6 items-center justify-center gap-1 py-2" />
        </>
      ) : null}
    </>
  );
}
