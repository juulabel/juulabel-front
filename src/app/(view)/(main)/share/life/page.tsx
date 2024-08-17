"use client";
import PostList from "@/_common/PostList";
import { IPostList } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ShareLayout from "@/_components/share/ShareLayout";
import { useCookies } from "react-cookie";

export default function Life() {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const {
    data: life,
    isLoading,
    error,
  } = useQuery<IPostList[]>({
    queryKey: ["life"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives?lastDailyLifeId=0&pageSize=1`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      return res.data.result;
    },
  });

  console.log(life);

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred : {error.message}</div>;
  if (!life) {
    return null;
  }

  // return (
  //   <ShareLayout>{life?.map((post) => <PostList {...post} />)}</ShareLayout>
  // );
}
