"use client";

import NoteThumbnail from "@/_common/NoteThumbnail";
import ShareLayout from "@/_components/share/ShareLayout";
import { INoteThumbnail } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Notes() {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery<INoteThumbnail[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes?pageSize=10`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );

      console.log(res.data);

      return res.data.result.tastingNoteSummaries.content;
    },
  });

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred : {error.message}</div>;

  return (
    <ShareLayout>
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
        {notes?.map((note) => (
          <NoteThumbnail key={note.TastingNoteId} {...note} />
        ))}
      </div>
    </ShareLayout>
  );
}
