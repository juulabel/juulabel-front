"use client";

import Loading from "@/_common/Loading";
import FollowHeader from "@/_components/follow/FollowHeader";
import RecommendedUserList from "@/_components/follow/RecommendedUserList";
import { useRegisterStore } from "@/_store/register";
import { RecommendedUser } from "@/_types/user/recommendedUser";
import { getRecommendedSommelier } from "@/app/api/user/getRecommendedSommelier";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { preferredAlcoholType } = useRegisterStore();
  const {
    data: recommendedSommelier,
    isLoading: isLoadingRecommendedSommelier,
    error,
  } = useQuery<RecommendedUser[]>({
    queryKey: ["recommendedSommelier"],
    queryFn: getRecommendedSommelier,
  });
  if (isLoadingRecommendedSommelier) return <Loading />;
  // if (error) return <div>Error : {error.message}</div>;
  // if (recommendedSommelier) {
  return (
    <div className="h-full w-full max-w-[560px]">
      <FollowHeader title="팔로우하기" />
      <div className="mx-[4%]">
        <p className="text-base font-medium leading-6 text-cool-grayscale-800">
          소믈리에 추천
        </p>
        <div className="text-sm leading-5 text-cool-grayscale-500">
          <p>주라벨 서비스 내에서 인증을 통해 소믈리에</p>
          <p>뱃지를 얻은 사람들이에요.</p>
        </div>
      </div>
      <RecommendedUserList recommendedUserList={[]} />
      <div className="mx-[4%]">
        <p className="text-base font-medium text-cool-grayscale-800">
          내 취향과 비슷한 유저들
        </p>
        <div className="text-sm text-cool-grayscale-500">
          <span className="flex flex-row">
            <p>선호하는 주종인</p>
            <p className="mx-1 text-cool-grayscale-700">
              {preferredAlcoholType.join(", ")}
            </p>
          </span>
          <p>를 좋아하는 사람들이에요.</p>
        </div>
      </div>
      <RecommendedUserList recommendedUserList={[]} />
    </div>
  );
}
