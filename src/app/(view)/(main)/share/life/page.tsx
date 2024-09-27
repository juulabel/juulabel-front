"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ShareLayout from "@/_components/share/ShareLayout";
import { useCookies } from "react-cookie";
import LifeList from "@/_common/LifeList";
import { ILifeList } from "@/_types/share";

export default function Life() {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const {
    data: life,
    isLoading,
    error,
  } = useQuery<ILifeList[]>({
    queryKey: ["life"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives?pageSize=10`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      return res.data.result.dailyLifeSummaries.content;
    },
  });

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred : {error.message}</div>;
  if (!life) {
    return null;
  }

  return (
    <ShareLayout>
      {life?.map((post) => <LifeList key={post.dailyLifeId} {...post} />)}
    </ShareLayout>
  );
}
