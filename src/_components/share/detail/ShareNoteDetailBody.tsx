"use client";
import getCurrentUserInfo from "@/app/api/common/getCurrentUserInfo";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ServerToast from "../error/ServerToast";
import LikeCommentFooter from "../LikeCommentFooter";
import ShareDetailNoteImageBox from "./ShareDetailNoteImageBox";
import ShareDetailReviewBox from "./ShareDetailReviewBox";
import ShareNoteInfoBox from "./ShareNoteInfoBox";
import SkeletonUI from "./SkeletonUI";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import clsx from "clsx";
import useMemberStore from "@/_store/memberStore";
import {
  useAuthorCheckStore,
  useCommentCountStore,
} from "@/_store/tastingDetailStore";

interface Props {
  id: number;
}

export default function ShareNoteDetailBody({ id }: Props) {
  const [cookies] = useCookies(["accessToken"]);
  const [errorToast, setErrorToast] = useState<boolean>(false);
  const { setIsAuthor } = useAuthorCheckStore();
  const { setCount } = useCommentCountStore();
  const { isCommentsPageVisible } = useCommentsPageStore();

  const { setMemberInfo } = useMemberStore();

  const [
    { data, isError, isFetching },
    { data: userData, isFetching: userFetching },
  ] = useQueries({
    queries: [
      {
        queryKey: ["noteDetail", id],
        queryFn: () =>
          getNoteDetail({
            token: cookies.accessToken,
            id: id,
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["currentUserInfo"],
        queryFn: () =>
          getCurrentUserInfo({
            token: cookies.accessToken,
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      },
    ],
  });

  useEffect(() => {
    if (data && userData) {
      setIsAuthor(
        data?.result.tastingNoteDetailInfo.memberInfo.memberId ===
          userData?.result.memberId,
      );

      setMemberInfo(userData.result);
      setCount(data.result.tastingNoteDetailInfo.commentCount);
    }

    if (isError && !isFetching) {
      setErrorToast(true);
    }
  }, [data, isFetching, isError, userData, userFetching, setIsAuthor]);

  if (isFetching) {
    return <SkeletonUI />;
  }

  if (errorToast) {
    return (
      <ServerToast
        text="데이터를 불러오는 중 에러가 발생했습니다."
        redirectPath="/share/note"
      />
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <section
        className={clsx(
          "h-full overflow-y-auto pb-[80px] pt-[64px] transition-all duration-700",
          {
            "animate-fadeOut scale-90 opacity-90 blur-lg scrollbar-hide":
              isCommentsPageVisible === "Y",
          },
        )}
      >
        <ShareDetailNoteImageBox
          info={data?.result?.tastingNoteDetailInfo}
          imageList={data?.result?.imageInfo.imageUrlList || []}
        />
        <ShareNoteInfoBox
          info={data?.result?.tastingNoteDetailInfo}
          alcoholicDrinksInfo={data?.result?.alcoholicDrinksInfo}
        />

        <Gap />

        <ShareDetailReviewBox
          info={data?.result?.tastingNoteDetailInfo}
          sensoryLevelIds={data?.result.sensoryLevelIds}
          flavorLevelIds={data?.result.flavorLevelIds}
          scentIds={data?.result.scentIds}
        />
        <LikeCommentFooter info={data?.result.tastingNoteDetailInfo} id={id} />
      </section>
    </div>
  );
}

function Gap() {
  return (
    <div className="mt-6 h-[10px] w-full border-t-2 bg-cool-grayscale-100"></div>
  );
}
