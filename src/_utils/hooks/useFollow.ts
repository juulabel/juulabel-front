import { IPaginatedData } from "@/_types";
import { RecommendedUser } from "@/_types/user/recommendedUser";
import { deleteFollower } from "@/app/api/user/follow/deleteFollower";
import { followUser } from "@/app/api/user/follow/followUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useProfileFollow(
  userId: string,
  isFollowed: boolean,
  nickname: string,
) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => followUser(userId),
    onMutate: async () => {
      queryClient.setQueryData(
        ["user", userId],
        (oldData: {
          isFollowed: boolean;
          followerCount: number;
          followingCount: number;
        }) => {
          if (!oldData) return oldData;
          const newIsFollowed = !oldData.isFollowed;
          return {
            ...oldData,
            isFollowed: newIsFollowed,
            followerCount: oldData.followerCount + (newIsFollowed ? 1 : -1),
          };
        },
      );
    },
    onSuccess: () => {
      if (!nickname) return;
      toast(
        !isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );
    },
    onError: (error) => {
      console.error("팔로우 상태 변경에 실패했습니다.", error);
      toast.error("팔로우 상태 변경에 실패했습니다.");
    },
  });

  return { mutate };
}

export function useCommonFollow(
  userId: string,
  type: "following" | "follower" | "recommendation",
) {
  const queryClient = useQueryClient();

  type FollowButtonMutateParams = {
    targetUserId: string;
    nickname: string;
    isFollowed: boolean;
  };

  const { mutate } = useMutation({
    mutationFn: ({ targetUserId }: FollowButtonMutateParams) => followUser(targetUserId),
    onSuccess: (_, { nickname, isFollowed }) => {
      toast(
        isFollowed
          ? `${nickname}님을 팔로우 취소했어요.`
          : `${nickname}님을 팔로우했어요.`,
      );

      if (type === "follower") {
        queryClient.invalidateQueries({
          queryKey: ["following", userId],
          refetchType: "all",
        });
      }

      if (type !== "recommendation") {
        queryClient.refetchQueries({
          queryKey: ["user", userId],
        });
      }
    },
    onError: () => {
      toast.error("팔로우 처리 중 오류가 발생했어요.");
      console.error("팔로우 처리 중 오류가 발생했습니다.");
    },
  });

  return { mutate };
}

// Helper function to update paginated data
const updatePaginatedData = (
  oldData: IPaginatedData | RecommendedUser[] | undefined,
  targetUserId: string
) => {
  if (!oldData) return oldData;
  
  if ("pages" in oldData) {
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        content: page.content.filter(
          (user) => user.id.toString() !== targetUserId,
        ),
      })),
    };
  }
  
  return oldData.filter((user) => user.id.toString() !== targetUserId);
};

export function useDeleteFollow(userId: string) {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteButton } = useMutation({
    mutationFn: ({ targetUserId }: { targetUserId: string }) => deleteFollower(targetUserId),
    onSuccess: (_, { targetUserId }) => {
      toast("팔로워 삭제 완료했습니다");

      // Update following data
      queryClient.setQueryData(
        ["following", userId],
        (oldData: IPaginatedData | RecommendedUser[] | undefined) => 
          updatePaginatedData(oldData, targetUserId)
      );

      // Update follower data
      queryClient.setQueryData(
        ["follower", userId],
        (oldData: IPaginatedData | RecommendedUser[] | undefined) => 
          updatePaginatedData(oldData, targetUserId)
      );

      queryClient.refetchQueries({
        queryKey: ["user", userId],
      });
    },
    onError: () => {
      console.error("팔로워 삭제 중 오류가 발생했습니다.");
      toast.error("팔로워 삭제에 실패했습니다.");
    },
  });

  return { mutate: handleDeleteButton };
}
