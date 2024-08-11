"use client";
import PostList from "@/_common/PostList";
import CommentFooter from "@/_components/reaction/CommentFooter";
import HeaderWithMenu from "@/_components/share/life/HeaderWithMenu";
import LifeViewer from "@/_components/share/life/LifeViewer";
import { ILifeDetail, IPostList } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface ILifeDetailPage {
  params: { dailyLifeId: string };
}

function LifeDetailPage({ params: { dailyLifeId } }: ILifeDetailPage) {
  // const {
  //   data: lifeDetail,
  //   isLoading,
  //   error,
  // } = useQuery<ILifeDetail>({
  //   queryKey: ["lifeDetail"],
  //   queryFn: async () => {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${dailyLifeId}`,
  //     );
  //     return res.data.life;
  //   },
  // });

  // 임시 에러 및 로딩 컴포넌트
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (error) return <div>An error occurred : {error.message}</div>;
  // if (!lifeDetail) {
  //   return null;
  // }

  const lifeDetail = {
    dailyLifeDetailInfo: {
      title: "test이것은 제목입니다...",
      content:
        "어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에 전통주 비중도 많이 늘어난 것 같아서 너무 좋았어요 ㅎㅎㅎ\n\n\n저는 탁주랑 과실주 위주로 마셔봤는데 A양조장의 전통주들이 특히나 마시기 좋았던 것 같아요. 어제 용산 아이파크몰에서 시음회가 열렸대서 찾아가봤어용 주종은 다양하게 구성이 되어있었는데 이번에 전통주 비중도 많이 늘어난 것 같아서 너무 좋았어요 ㅎㅎㅎ\n저는 탁주랑 과실주 위주로 마셔봤는데 A양조장의 전통주들이 특히나 마시기 좋았던 것 같아요.",
      dailyLifeId: 17,
      memberInfo: {
        memberId: 5,
        nickname: "테스트용",
        profileImage: null,
      },
      createdAt: "2024-08-02T01:44:41",
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
    },
    dailyLifeImageInfo: {
      // imageUrlList: [
      //   "https://juulabel.s3.ap-northeast-2.amazonaws.com/daily-life%5C2024/08/02%5Caa4bc58a4bbf4755files",
      //   "https://juulabel.s3.ap-northeast-2.amazonaws.com/daily-life%5C2024/08/02%5C69fd653687284784files",
      //   "https://juulabel.s3.ap-northeast-2.amazonaws.com/daily-life%5C2024/08/02%5C69fd653687284784files",
      // ],
      imageUrlList: [],
      imageCount: 3,
    },
  };

  const {
    dailyLifeDetailInfo: {
      title,
      content,
      memberInfo: { nickname, profileImage },
      createdAt,
      likeCount,
      commentCount,
    },
    dailyLifeImageInfo: { imageUrlList, imageCount },
  } = lifeDetail;

  return (
    <>
      <HeaderWithMenu title="전통주 일상생활" />
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
