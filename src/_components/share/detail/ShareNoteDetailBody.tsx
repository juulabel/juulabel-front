"use client";
import { useAuthorCheckStore } from "@/_store/tastingDetailAutorCheckStore";
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

interface Props {
  id: number;
}

export default function ShareNoteDetailBody({ id }: Props) {
  const [cookies] = useCookies(["accessToken"]);
  const [errorToast, setErrorToast] = useState<boolean>(false);
  const { setIsAuthor } = useAuthorCheckStore();

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
        // enabled: !cookies.accessToken,
      },
      {
        queryKey: ["currentUserInfo"],
        queryFn: () =>
          getCurrentUserInfo({
            token: cookies.accessToken,
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        // enabled: !cookies.accessToken,
      },
    ],
  });

  useEffect(() => {
    if (data && userData) {
      // 헤더 컴포넌트에서 현재 글 작성자인지 체크함
      setIsAuthor(
        data?.result.tastingNoteDetailInfo.memberInfo.nickname ===
          userData.result.nickname,
      );
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
    <>
      <ShareDetailNoteImageBox
        info={data?.result?.tastingNoteDetailInfo}
        imageList={data?.result?.imageInfo.imageUrlList || []}
      />
      <ShareNoteInfoBox info={data?.result?.tastingNoteDetailInfo} />

      <Gap />

      <ShareDetailReviewBox
        info={data?.result?.tastingNoteDetailInfo}
        sensoryLevelIds={data?.result.sensoryLevelIds}
        flavorLevelIds={data?.result.flavorLevelIds}
      />
      <LikeCommentFooter info={data?.result.tastingNoteDetailInfo} />
    </>
  );
}

function Gap() {
  return (
    <div className="w-ful mt-6 h-[10px] border-t-2 bg-cool-grayscale-100"></div>
  );
}
