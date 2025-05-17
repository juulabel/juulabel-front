"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import AlcoholSearchDataThumbnail from "@/_components/search/AlcoholSearchDataThumbnailThumbnail";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import Loading from "@/_common/Loading";
import useInfiniteScroll from "@/_utils/hooks/useInfiniteScroll";

export default function Page() {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const {
    data: brewery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["brewery", 1],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/search`,
        {
          params: {
            search: "느린마을",
            lastAlcoholicDrinksName: pageParam?.lastAlcoholicDrinksName || null,
            pageSize: 10,
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      const alcoholicDrinks = res.data.result;

      return {
        content: alcoholicDrinks.alcoholicDrinks,
        nextPage: alcoholicDrinks.isLast
          ? null
          : {
              lastAlcoholicDrinksName:
                alcoholicDrinks.alcoholicDrinks.slice(-1)[0]?.name || "",
            },
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: { lastAlcoholicDrinksName: "" },
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

  return (
    <div className="h-full w-full max-w-[560px]">
      <HeaderWithButton title={"양조장 정보"} buttonType={""} />

      <div className="flex flex-col items-start justify-start gap-4 border-b p-4">
        <div className="inline-flex items-center justify-start gap-3">
          <div className="text-lg font-bold leading-[27px] text-slate-800">
            탁브루
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2.5 self-stretch rounded-lg border border-slate-200 p-2">
          <div className="flex flex-col items-start justify-start gap-1">
            <div className="inline-flex items-center justify-start gap-1">
              <div className="relative h-4 w-4" />
              <div className="text-xs font-medium leading-none text-slate-500">
                지역
              </div>
            </div>
            <div className="self-stretch text-sm font-bold leading-[21px] text-slate-700">
              인천광역시 부평구 경인로
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 text-xl font-bold leading-7 text-slate-800">
        탁브루의 전통주들
      </div>
      <div className="gay-y-5 grid grid-cols-2 gap-x-2 overflow-y-auto px-4 py-6">
        {brewery?.map((post) => (
          <AlcoholSearchDataThumbnail key={post.dailyLifeId} {...post} />
        ))}
      </div>
      <div ref={observerRef} className="loading-indicator">
        {isFetchingNextPage ? (
          <Loading />
        ) : hasNextPage ? (
          <p>Loading more...</p>
        ) : (
          <br />
        )}
      </div>
    </div>
  );
}
