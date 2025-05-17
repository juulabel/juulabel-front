"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import postNoteComments from "@/app/api/tasting-note/postNoteComments";
import Button from "@/_common/ui/Button";
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import useCommentsPOST from "@/_utils/hooks/useCommentsPOST";
import { IApiResponse, IComment } from "@/_types";

interface Props {
  id: number;
  isLife?: boolean;
}

export default function CommentsFooter({ id, isLife }: Props) {
  const MAX_LENGTH = 600;
  const textRef = useRef<HTMLTextAreaElement>(null);

  const { isCommentsPageVisible } = useCommentsPageStore();

  const { isOpen: replyComponentIsOpen, commentInfo } =
    useReplyComponentStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const handleResizeHeight = useCallback(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;

      setIsSubmitting(true);
      submit();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textLength = e.target.value.length;

    handleResizeHeight();

    if (textLength >= MAX_LENGTH) {
      setBtnDisabled(true);
      e.target.value = e.target.value.slice(0, MAX_LENGTH);
    } else if (btnDisabled && textLength > 0) {
      setBtnDisabled(false);
    }

    if (textLength === 0) setBtnDisabled(true);
  };

  const { mutate } = useCommentsPOST({
    setIsSubmitting: setIsSubmitting,
    postId: id,
    textRef: textRef,
    setBtnDisabled: setBtnDisabled,
    isLife: isLife,
  });

  const submit = () => {
    const textValue = textRef.current?.value || "";
    //replyComponentIsOpen 이 true이면 대댓글 아니면 댓글

    if (!textValue.trim()) {
      toast("댓글을 입력해주세요");
      return;
    }

    if (!btnDisabled) {
      mutate({
        id: id,
        content: textValue,
        ...(replyComponentIsOpen
          ? { parentCommentId: commentInfo?.commentId }
          : {}),
      });
    }
  };

  useEffect(() => {}, []);

  if (isCommentsPageVisible !== "Y") {
    return null;
  }
  return (
    <footer className="fixed bottom-0 z-50 grid w-full max-w-[560px] grid-cols-[5fr_1fr] items-end justify-center gap-3 bg-[#FFFFFF] px-6 py-[16px] shadow-[0px_-4px_32px_0px_#00000012]">
      <textarea
        placeholder="댓글 추가하기"
        rows={1}
        ref={textRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="h-[40px] w-full resize-none overflow-hidden rounded-[6px] border-[1px] border-cool-grayscale-300 px-3 py-2 transition-colors duration-300 focus:!border-cool-grayscale-700 focus:!ring-0 focus-visible:outline-none"
      />

      <div className="items- flex justify-center">
        <Button
          variant="primary"
          className="h-[40px] w-[69px] rounded-[4px]"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            const textValue = textRef.current?.value || "";
            e.stopPropagation();

            if (isSubmitting) return;

            if (textValue.length >= MAX_LENGTH) {
              toast("댓글 최대 길이는 600 자 입니다.");
            } else {
              setIsSubmitting(true);
              submit();
            }
          }}
          disabled={btnDisabled}
        >
          입력
        </Button>
      </div>
    </footer>
  );
}
