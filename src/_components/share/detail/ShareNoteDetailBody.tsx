"use client";
import React, { useEffect, useRef, useState } from "react";
import ShareDetailNoteImageBox from "./ShareDetailNoteImageBox";
import ShareNoteInfoBox from "./ShareNoteInfoBox";
import ShareDetailReviewBox from "./ShareDetailReviewBox";
import LikeCommentFooter from "../LikeCommentFooter";
import { useQueries, useQuery } from "@tanstack/react-query";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useCookies } from "react-cookie";
import ServerToast from "../error/ServerToast";
import { IApiResponse, ITastingNoteResponse } from "@/_types";
import getCurrentUserInfo from "@/app/api/common/getCurrentUserInfo";
import {
  useAuthorCheckStore,
  useCommentCountStore,
  useCommentStore,
} from "@/_store/tastingDetailStore";
import { useRegisterStore } from "@/_store/register";
import SkeletonUI from "./SkeletonUI";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import clsx from "clsx";
import useMemberStore from "@/_store/memberStore";

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

      setMemberInfo(userData.result);

      //댓글 수
      setCount(data.result.tastingNoteDetailInfo.commentCount);
    }

    if (isError && !isFetching) {
      setErrorToast(true);
    }
  }, [isFetching, isError, userData, userFetching]);

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
    <section
      className={clsx("pt-[64px] transition-all duration-700", {
        "animate-fadeOut scale-90 overflow-hidden opacity-90 blur-lg":
          isCommentsPageVisible === "Y",
      })}
    >
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
      <LikeCommentFooter info={data?.result.tastingNoteDetailInfo} id={id} />
    </section>
  );
}

function Gap() {
  return (
    <div className="mt-6 h-[10px] w-full border-t-2 bg-cool-grayscale-100"></div>
  );
}
