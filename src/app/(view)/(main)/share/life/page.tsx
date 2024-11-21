"use client";

import LifeList from "@/_common/LifeList";
import Loading from "@/_common/Loading";
import ServerToast from "@/_components/share/error/ServerToast";
import ShareLayout from "@/_components/share/ShareLayout";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Life() {
  const [cookies, setCookie] = useCookies(["accessToken"]);

  const {
    data: life,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["life"],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives`,
        {
          params: {
            lastDailyLifeId: pageParam?.lastDailyLifeId || "",
            pageSize: 10,
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      const dailyLifeSummaries = res.data.result.dailyLifeSummaries;

      return {
        content: dailyLifeSummaries.content,
        nextPage: dailyLifeSummaries.last
          ? null
          : {
              lastDailyLifeId:
                dailyLifeSummaries.content.slice(-1)[0]?.dailyLifeId || "",
            },
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastDailyLifeId: "" },
    select: (data) => {
      return data.pages.flatMap((page) => page.content);
    },
    gcTime: 0,
    staleTime: 0,
  });

  const observerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isFetchingNextPage) return <Loading />;
  if (isError)
    return <ServerToast text="에러가 발생했습니다" redirectPath="/" />;

  if (!life) {
    return null;
  }

  return (
    <ShareLayout>
      {life?.map((post) => <LifeList key={post.dailyLifeId} {...post} />)}
      <div ref={observerRef} className="loading-indicator">
        {isFetchingNextPage ? (
          <Loading />
        ) : hasNextPage ? (
          <p>Loading more...</p>
        ) : (
          <br />
        )}
      </div>
    </ShareLayout>
  );
}
