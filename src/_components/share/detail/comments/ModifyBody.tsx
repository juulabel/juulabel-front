"use client";

import useCommentsModalStore from "@/_store/tastingCommentModal";
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import Image from "next/image";
import useCommentsModify from "@/_utils/hooks/useCommentsModify";
import ServerToast from "../../error/ServerToast";
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useParams, usePathname, useRouter } from "next/navigation";
import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";

export default function ModifyBody() {
  const MAX_LENGTH = 600;

  const { isOpen, commentId, postId, content, closeModal } =
    useCommentsModalStore();

  const { id } = useParams();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [checkModalOpen, setCheckModalOpen] = useState<boolean>(false);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLife = pathname.includes("life");

  const { mutate } = useCommentsModify();

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textLength = e.target.value.length;

    if (textLength >= MAX_LENGTH) {
      setDisabled(true);
      e.target.value = e.target.value.slice(0, MAX_LENGTH);
    } else if (disabled && textLength > 0) {
      setDisabled(false);
    }

    if (textLength === 0) setDisabled(true);
  };

  const backRouting = () => {
    //변경사항이 생긴거
    if (content !== textRef.current?.value) {
      setCheckModalOpen(true);
    } else {
      backPush();
    }
  };

  const backPush = () => {
    router.push(isLife ? `/share/life/${postId}` : `/share/note/${postId}`);
  };

  useEffect(() => {
    if (content && textRef.current) {
      textRef.current.value = content;
    }
  }, []);

  if (!postId || !commentId) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 z-10 flex h-[64px] w-full max-w-[560px] items-center justify-between border-b border-gray-300 bg-white px-3">
        <div className="cursor-pointer">
          <Image
            src={"/svg/left_arrow.svg"}
            width={32}
            height={32}
            alt="left"
            onClick={(e: MouseEvent<HTMLImageElement>) => {
              e.preventDefault();
              e.stopPropagation();

              backRouting();
            }}
          />
        </div>
        <div className="text-[18px] font-semibold text-[#334155]">
          댓글 수정
        </div>

        <div
          className="cursor-pointer text-[16px] font-normal text-primary-700"
          onClick={() => {
            if (isOpen) closeModal();

            mutate({
              postId,
              commentId,
              content: textRef.current?.value || "",
              isLife: isLife,
            });
          }}
        >
          완료
        </div>
      </div>
      <textarea
        ref={textRef}
        onInput={handleInput}
        className="h-[600px] w-full resize-none border-none bg-transparent p-[16px] text-[16px] font-normal text-cool-grayscale-700 focus:outline-none focus:ring-0"
        placeholder="댓글을 입력해주세요."
      ></textarea>
      {checkModalOpen && (
        <ModalLayout
          onClose={() => {
            setCheckModalOpen(false);
          }}
        >
          <div className="flex h-full w-full flex-col items-center gap-3">
            <div className="w-full text-center text-[18px] font-bold leading-[27px] text-cool-grayscale-800">
              댓글 수정을 그만두시겠어요?
            </div>
            <div className="text-[16px3 mb-3 font-normal text-cool-grayscale-600">
              변경된 내용은 저장되지 않아요.
            </div>

            <Button
              variant="primary"
              className="h-[39px] w-full"
              onClick={() => {
                backPush();
              }}
            >
              나가기
            </Button>
            <Button
              variant="secondary"
              className="h-[39px] w-full"
              onClick={() => {
                setCheckModalOpen(false);
              }}
            >
              닫기
            </Button>
          </div>
        </ModalLayout>
      )}
    </>
  );
}
