import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import { IApiResponse } from "@/_types";
import { ILifeDetail, ILifeDetailInfo } from "@/_types/share";
import postLifeLike from "@/app/api/life/postLifeLike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCookies } from "react-cookie";

interface Props {
  info: ILifeDetailInfo | undefined;
  dailyLifeId: string;
}

export default function CommentFooter({ info, dailyLifeId }: Props) {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  const {
    isCommentsPageVisible,
    setCommentsPageVisible,
    setIsInitialized,
    isInitialized,
  } = useCommentsPageStore();

  const handleCommentsPage = () => {
    // router.push(`/share/note/${id}/comments`);
    setCommentsPageVisible("Y");
  };

  const { mutate } = useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      postLifeLike({
        token,
        id,
      }),
    onMutate: async ({ token, id }) => {
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

          const isCurrentlyLiked = oldData.result.dailyLifeDetailInfo.isLiked;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              dailyLifeDetailInfo: {
                ...oldData.result.dailyLifeDetailInfo,
                isLiked: !isCurrentlyLiked,
                likeCount: isCurrentlyLiked
                  ? oldData.result.dailyLifeDetailInfo.likeCount - 1
                  : oldData.result.dailyLifeDetailInfo.likeCount + 1,
              },
            },
          };
        },
      );

      return { previousPostData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["life", variables.id],
        context?.previousPostData,
      );
    },
    onSettled: (data, error, variables) => {
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
            src={info?.isLiked ? "/svg/like_full.svg" : "/svg/like.svg"}
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
            src="/images/icons/comment.png"
            alt="댓글 아이콘"
            width={26}
            height={22}
          />
          <div className="text-sm">{info?.commentCount}</div>
        </div>
      </footer>
    </>
  );
}
