"use client";
import React, { useEffect, useRef, useState } from "react";
import ReplyInput from "./ReplyInput";
import Image from "next/image";
import ReplyList from "./ReplyList";
import clsx from "clsx";

interface Props {
  replyOpen: boolean;
  handleReplyClose: () => void;
  tastingNoteId: number;
  parentCommentId: number;
}

export default function ReplyBody({
  replyOpen,
  handleReplyClose,
  parentCommentId,
  tastingNoteId,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>("0px");
  useEffect(() => {
    if (contentRef.current && replyOpen) {
      setHeight(`${Number(contentRef.current.scrollHeight) + 96}px`);
    } else {
      setHeight("0px");
    }
  }, [replyOpen]);
  return (
    <section
      className={clsx(
        "flex flex-col gap-2 overflow-y-auto transition-all duration-700 ease-in-out",
        {
          "max-h-96": replyOpen,
          "max-h-0": !replyOpen,
        },
      )}
    >
      <div
        className="gap-[1px flex cursor-pointer items-center px-[16px] pt-[12px]"
        onClick={handleReplyClose} // 함수 바로 전달
      >
        <Image
          src="/svg/down_arrow.svg"
          width={20}
          height={20}
          alt="tets"
          className={clsx("transform transition-transform", {
            "rotate-180": replyOpen, // 열린 상태에서는 화살표를 뒤집음
            "rotate-0": !replyOpen, // 닫힌 상태에서는 원래 위치로
          })}
        />
        <span>답글 접기</span>
      </div>

      <div ref={contentRef} className="w-full">
        <ReplyInput
          parentCommentId={parentCommentId}
          tastingNoteId={tastingNoteId}
        />
        <ReplyList
          parentCommentId={parentCommentId}
          tastingNoteId={tastingNoteId}
        />
      </div>
    </section>
  );
}
