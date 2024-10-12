"use client";

import Button from "@/_common/ui/Button";
import { ChangeEvent, useCallback, useRef } from "react";

export default function CommentsFooter() {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = useCallback(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleResizeHeight();
  };

  return (
    <footer className="shadow-[0px_-4px_32px_0px_#00000012 fixed bottom-0 grid min-h-[117px] w-full max-w-[560px] grid-cols-[4fr_1fr] items-center justify-center px-[20px]">
      <textarea
        rows={1}
        ref={textRef}
        onInput={handleInput}
        className="h-[40px] w-full resize-none overflow-hidden rounded-[6px] border-[1px] border-cool-grayscale-300 px-3 py-2 focus:!border-cool-grayscale-700 focus:!ring-0 focus-visible:outline-none"
      />

      <div className="flex items-center justify-center">
        <Button variant="primary" className="h-[40px] w-[69px] rounded-[4px]">
          확인
        </Button>
      </div>
    </footer>
  );
}
