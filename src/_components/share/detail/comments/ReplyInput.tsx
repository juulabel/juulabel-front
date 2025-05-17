"use client";

import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import postNoteComments from "@/app/api/tasting-note/postNoteComments";
import Button from "@/_common/ui/Button";

const MAX_LENGTH = 600;

interface Props {
  postId: number;
  parentCommentId: number;
  isLife?: boolean;
}

export default function ReplyInput({ postId, parentCommentId, isLife }: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [cookies] = useCookies(["accessToken"]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const queryClient = useQueryClient();

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
      mutate({
        token: cookies.accessToken,
        id: postId,
        content: textRef.current?.value || "",
        parentCommentId: parentCommentId,
      });
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

  const { mutate } = useMutation({
    mutationFn: ({
      token,
      id,
      content,
      parentCommentId,
    }: {
      token: string;
      id: number;
      content: string;
      parentCommentId: number;
    }) => {
      setIsSubmitting(true);
      handleResizeHeight();
      return postNoteComments({
        id: id,
        content: content,
        parentCommentId: parentCommentId,
      });
    },
    onSuccess: (data) => {
      toast("답글을 추가했어요.");

      setIsSubmitting(false);

      queryClient.invalidateQueries({
        queryKey: [isLife ? "lifeComments" : "noteComments", Number(postId)],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["getReply", postId, parentCommentId],
      });
      if (textRef.current) {
        textRef.current.value = "";
        setBtnDisabled(true);
      }
    },
    onError: (error) => {
      toast("답글 추가를 실패했어요.");
      setIsSubmitting(false);
    },
  });

  return (
    <section className="w-full px-[16px]">
      <div className="flex flex-row gap-4">
        <textarea
          rows={1}
          ref={textRef}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className="h-[40px] w-full resize-none overflow-hidden rounded-[6px] border-[1px] border-cool-grayscale-300 px-3 py-2 transition-colors duration-300 focus:!border-cool-grayscale-700 focus:!ring-0 focus-visible:outline-none"
        />
        <div className="flex items-center justify-center">
          <Button
            variant="primary"
            className="h-[40px] w-[69px] rounded-[4px]"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              e.preventDefault();

              if (isSubmitting) return;

              const textValue = textRef.current?.value || "";

              if (textValue.length >= MAX_LENGTH) {
                toast("댓글 최대 길이는 600 자 입니다.");
              } else {
                mutate({
                  token: cookies.accessToken,
                  id: postId,
                  content: textValue,
                  parentCommentId: parentCommentId,
                });
              }
            }}
            disabled={btnDisabled}
          >
            입력
          </Button>
        </div>
      </div>
    </section>
  );
}
