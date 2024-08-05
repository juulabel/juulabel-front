"use client";
import PostList from "@/_common/PostList";
import { IPostList } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ShareLayout from "@/_components/share/ShareLayout";

export default function Life() {
  const {
    data: life,
    isLoading,
    error,
  } = useQuery<IPostList[]>({
    queryKey: ["life"],
    queryFn: async () => {
      const res = await axios.get("https://api.example.com/v1/api/share/life");
      return res.data.life;
    },
  });

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred : {error.message}</div>;

  return (
    <ShareLayout>{life?.map((post) => <PostList {...post} />)}</ShareLayout>
  );
}
