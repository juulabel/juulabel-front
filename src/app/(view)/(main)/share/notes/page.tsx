"use client";

import NoteThumbnail from "@/_common/NoteThumbnail";
import { INoteThumbnail } from "@/_types/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ShareLayout from "@/_components/share/ShareLayout";

export default function Notes() {
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery<INoteThumbnail[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await axios.get("https://api.example.com/v1/api/share/notes");
      return res.data.notes;
    },
  });

  // 임시 에러 및 로딩 컴포넌트
  if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>An error occurred : {error.message}</div>;

  return (
    <ShareLayout>
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 overflow-y-auto px-4 py-6">
        {notes?.map((note) => <NoteThumbnail {...note} />)}
      </div>
    </ShareLayout>
  );
}
