"use client";
import CommentFooter from "@/_components/reaction/CommentFooter";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import LifeViewer from "@/_components/share/life/LifeViewer";
import { ILifeDetail } from "@/_types/share";
import { instance } from "@/app/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

interface ILifeDetailPage {
  params: { dailyLifeId: string };
}

function LifeDetailPage({ params: { dailyLifeId } }: ILifeDetailPage) {
  const searchParams = useSearchParams();
  const posted = searchParams.get("posted");
  const [cookie, setCookie] = useCookies(["accessToken"]);
  const {
    data: lifeDetail,
    isLoading,
    error,
  } = useQuery<ILifeDetail>({
    queryKey: ["lifeDetail", dailyLifeId],
    queryFn: async () => {
      const res = await instance.get(`/v1/api/daily-lives/${dailyLifeId}`, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });      
      return res.data.result;
    },
  });

  useEffect(() => {
    if (posted === "true") {
      toast("일상생활 작성이 완료되었어요.");
    }
  }, []);

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>An error occurred : {error.message}</div>;
  if (!lifeDetail) {
    return null;
  }

  const {
    dailyLifeDetailInfo: {
      title,
      content,
      memberInfo: { nickname, profileImage },
      createdAt,
      likeCount,
      commentCount,
    },
    imageInfo: { imageUrlList, imageCount },
  } = lifeDetail;

  return (
    <>
      <HeaderWithButton
        title="전통주 일상생활"
        buttonType="meatballs"
        titleLink="/share/life"
      />
      <div className="h-dvh overflow-y-scroll pb-[62px] pt-16 scrollbar-hide">
        <LifeViewer
          title={title}
          content={content}
          nickname={nickname}
          profileImage={profileImage}
          createdAt={createdAt}
          imageUrlList={imageUrlList}
          imageCount={imageCount}
        />
      </div>
      <CommentFooter likeCount={likeCount} commentCount={commentCount} />
    </>
  );
}
export default LifeDetailPage;
