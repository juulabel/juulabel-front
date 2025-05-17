"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import getTraditionalLiquor from "@/app/api/tasting-note/getTraditionalLiquor";
import RadarChart from "@/_components/tasting-note/write/HexagonChart";
import { IResponseTranditionalLiquor } from "@/_types/tasting-note/officialData";
import { mapImageUrl, parseNumberOfDefault } from "@/_utils/commons";
import { IApiResponse } from "@/_types";
import Separator from "../Separator";
import MoonRating from "./MoonRating";
import ShareAboutAlcoholReview from "./ShareAboutAlcoholReview";
import ShareAboutTheSmellOfAlcohol from "./ShareAboutTheSmellOfAlcohol";

export default function ShareTraditionalLiquorSkeletonUI() {
  const mediumTextStyle = "text-[16px] font-normal text-cool-grayscale-700";

  const router = useRouter();

  return (
    <>
      <div className="relative h-[216px] w-full">
        <Skeleton
          className="top-0 h-full w-full bg-cool-grayscale-300"
          baseColor="#d1d5db"
          highlightColor="#f3f4f6"
          duration={1.5}
          style={{
            position: "absolute",
          }}
        />

        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/left_arrow_white.svg`}
          width={28}
          height={28}
          alt="<"
          className="absolute left-5 top-1/3 z-10 -translate-y-1/2 cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />

        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <p className="bg-transparent text-[18px] text-white">
            전통주 상세 소게
          </p>
        </div>
      </div>

      {/* Overlay Content */}
      <div className="absolute top-[150px] flex min-h-[80%] w-full flex-col items-center rounded-t-[24px] border bg-white px-4">
        <div className="flex w-full flex-col items-center justify-between gap-10 px-1">
          <section className="gap- grid w-full grid-cols-[1.4fr_1fr] items-center justify-center pt-5">
            <div className="relative flex w-[80%] flex-col justify-center gap-2">
              <Skeleton height={25} style={{ position: "absolute" }} />
              <Skeleton height={25} style={{ position: "absolute" }} />
              <Skeleton height={25} style={{ position: "absolute" }} />
              <Skeleton height={25} style={{ position: "absolute" }} />
            </div>

            <div className="flex items-center justify-center">
              <Skeleton height={135} width={150} />
            </div>
          </section>
        </div>
        <Gap />
        <div className="flex w-full flex-col">
          <div className="relative flex w-full flex-row gap-2">
            <Skeleton
              height={25}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>

          <div className="text-[16px] font-semibold text-cool-grayscale-700"></div>
        </div>
        <Gap />
        <div className="flex w-full flex-col">
          <div className="relative flex w-full flex-row gap-2">
            <Skeleton
              height={25}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>

          <div className="flex flex-row items-center gap-2 text-cool-grayscale-700"></div>
        </div>
        <Gap />
        <div className="relative flex w-full flex-row">
          <Skeleton height={50} width="100%" style={{ position: "absolute" }} />
        </div>

        <section className="mt-4 flex h-full w-full flex-col items-center gap-10">
          <div className="relative flex w-full flex-row">
            <Skeleton
              height={50}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>
          <div className="relative flex w-full flex-row">
            <Skeleton
              height={50}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>
          <div className="relative flex w-full flex-row">
            <Skeleton
              height={50}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>
          <div className="relative flex w-full flex-row">
            <Skeleton
              height={50}
              width="100%"
              style={{ position: "absolute" }}
            />
          </div>
        </section>
      </div>
    </>
  );
}

function MiddleLine() {
  return (
    <div className="my-5 h-2 w-screen max-w-[560px] bg-cool-grayscale-100"></div>
  );
}

function Gap() {
  return <div className="my-3 h-[1px] w-full bg-cool-grayscale-100" />;
}
