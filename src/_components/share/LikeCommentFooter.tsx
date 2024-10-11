"use client";
import {
  IApiResponse,
  ITastingNoteDetailInfo,
  ITastingNoteResponse,
} from "@/_types";
import postNoteLike from "@/app/api/tasting-note/postNoteLike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { RxChatBubble } from "react-icons/rx";

interface Props {
  info: ITastingNoteDetailInfo | undefined;
}

export default function LikeCommentFooter({ info }: Props) {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      postNoteLike({
        token,
        id,
      }),
    onMutate: async ({ token, id }) => {
      await queryClient.cancelQueries({
        queryKey: ["noteDetail", id],
      });
      const previousNoteData = queryClient.getQueryData(["noteDetail", id]);

      queryClient.setQueryData(
        ["noteDetail", id],
        (oldData: IApiResponse<ITastingNoteResponse>) => {
          if (!oldData) return oldData;

          const isCurrentlyLiked = oldData.result.tastingNoteDetailInfo.isLiked;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              tastingNoteDetailInfo: {
                ...oldData.result.tastingNoteDetailInfo,
                isLiked: !isCurrentlyLiked,
                likeCount: isCurrentlyLiked
                  ? oldData.result.tastingNoteDetailInfo.likeCount - 1
                  : oldData.result.tastingNoteDetailInfo.likeCount + 1,
              },
            },
          };
        },
      );

      return { previousNoteData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["note", variables.id],
        context?.previousNoteData,
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["note", variables.id],
      });
    },
  });

  const handleLikeClick = () => {
    if (info?.tastingNoteId) {
      mutate({
        token: cookies.accessToken,
        id: info.tastingNoteId,
      });
    }
  };
  return (
    <footer className="fixed bottom-0 z-40 flex h-[82px] w-full max-w-[560px] flex-row items-center justify-between bg-[#FFFFFF] p-5 px-6 shadow-[0px_-4px_32px_0px_#00000012]">
      <div className="flex items-center gap-3">
        <Image
          src={info?.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}
          width={30}
          height={30}
          alt="좋아요"
          onClick={handleLikeClick}
        />

        <div className="text-[21px] font-bold">
          {info?.likeCount} 명이 좋아합니다.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Image
          src={"/svg/speech_bubble.svg"}
          width={30}
          height={30}
          alt="좋아요"
          onClick={handleLikeClick}
        />
        <span className="text-[18px]">{info?.commentCount}</span>
      </div>
    </footer>
  );
}
