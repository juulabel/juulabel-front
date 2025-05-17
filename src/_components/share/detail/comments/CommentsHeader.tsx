"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLifeDetail } from "@/app/api/life/getLifeDetail";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import useReplyComponentStore from "@/_store/replyComponentStore";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import {
  useCommentCountStore,
  useCommentStore,
} from "@/_store/tastingDetailStore";

interface Props {
  isLife?: boolean;
}

export default function CommentsHeader({ isLife }: Props) {
  const router = useRouter();

  const { count } = useCommentCountStore();
  const {
    isOpen: replyComponentIsOpen,
    onClose,
    setCommentInfo,
  } = useReplyComponentStore();
  const { id } = useParams();
  const { isCommentsPageVisible, setCommentsPageVisible, setIsInitialized } =
    useCommentsPageStore();
  const { data, isFetching } = useQuery({
    queryKey: [isLife ? "lifeDetail" : "noteDetail", Number(id)],
    queryFn: () =>
      isLife
        ? getLifeDetail({
            id: Number(id),
          })
        : getNoteDetail({
            id: Number(id),
          }),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 신선하다고 판단
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    enabled: !!id,
  });

  useEffect(() => {}, [isFetching]);

  return (
    <div className="fixed top-0 z-50 flex h-[64px] w-full max-w-[560px] flex-row items-center justify-center gap-2 border-b border-gray-300 bg-white px-3">
      <Image
        className="absolute left-4 cursor-pointer"
        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/left_arrow.svg`}
        width={32}
        height={32}
        alt="cancel"
        onClick={() => {
          if (replyComponentIsOpen) {
            onClose();
          } else {
            // router.push(`/share/note/${id}`);
            setCommentsPageVisible("P");
            setCommentInfo(null);
          }
        }}
      />
      {!replyComponentIsOpen && (
        <>
          <div className="text-[18px] font-bold text-cool-grayscale-700">
            댓글
          </div>
          <div className="text-[16px] font-normal text-cool-grayscale-500">
            {isLife
              ? data?.result.dailyLifeDetailInfo.commentCount
              : data?.result.tastingNoteDetailInfo.commentCount}
            개
          </div>
        </>
      )}
    </div>
  );
}
