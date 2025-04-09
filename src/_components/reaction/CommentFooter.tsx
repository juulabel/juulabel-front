import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import { IApiResponse } from "@/_types";
import { ILifeDetail, ILifeDetailInfo } from "@/_types/share";
import postLifeLike from "@/app/api/life/postLifeLike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { memo, useCallback } from "react";

interface Props {
  info: ILifeDetailInfo | undefined;
  dailyLifeId: string;
}

const CommentFooter = memo(function CommentFooter({
  info,
  dailyLifeId,
}: Props) {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  const {
    isCommentsPageVisible,
    setCommentsPageVisible,
    setIsInitialized,
    isInitialized,
  } = useCommentsPageStore();

  const handleCommentsPage = useCallback(() => {
    setCommentsPageVisible("Y");
  }, [setCommentsPageVisible]);

  const { mutate } = useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      postLifeLike({
        token,
        id,
      }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["lifeDetail", dailyLifeId],
      });
      const previousPostData = queryClient.getQueryData([
        "lifeDetail",
        dailyLifeId,
      ]);

      queryClient.setQueryData(
        ["lifeDetail", dailyLifeId],
        (oldData: IApiResponse<ILifeDetail>) => {
          if (!oldData) return oldData;
          const { dailyLifeDetailInfo } = oldData.result;
          const isCurrentlyLiked = dailyLifeDetailInfo.isLiked;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              dailyLifeDetailInfo: {
                ...dailyLifeDetailInfo,
                isLiked: !isCurrentlyLiked,
                likeCount: isCurrentlyLiked
                  ? dailyLifeDetailInfo.likeCount - 1
                  : dailyLifeDetailInfo.likeCount + 1,
              },
            },
          };
        },
      );

      return { previousPostData };
    },
    onError: (_, variables, context) => {
      queryClient.setQueryData(
        ["life", variables.id],
        context?.previousPostData,
      );
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["life", variables.id],
      });
    },
  });

  const handleLikeClick = () => {
    if (info?.dailyLifeId) {
      mutate({
        token: cookies.accessToken,
        id: info.dailyLifeId,
      });
    }
  };

  return (
    <>
      <div
        className="fixed bottom-[47px] z-10 h-4 w-full max-w-[560px]"
        style={{ boxShadow: "0px -4px 32px rgba(0, 0, 0, 0.07)" }}
      />
      <footer className="fixed bottom-0 z-10 flex h-[62px] w-full max-w-[560px] items-center justify-between space-x-2 bg-white p-4 px-4 py-2 text-cool-grayscale-500">
        <div className="flex items-center space-x-2">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}${info?.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}`}
            alt="좋아요 아이콘"
            width={22}
            height={22}
            onClick={handleLikeClick}
          />
          <div className="text-sm">
            <strong className="font-bold text-cool-grayscale-500">
              {info?.likeCount}명
            </strong>
            이 좋아합니다.
          </div>
        </div>

        <div
          onClick={handleCommentsPage}
          className="flex items-center space-x-2"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/icons/comment.png`}
            alt="댓글 아이콘"
            width={26}
            height={22}
          />
          <div className="text-sm">{info?.commentCount}</div>
        </div>
      </footer>
    </>
  );
});

export default CommentFooter;
