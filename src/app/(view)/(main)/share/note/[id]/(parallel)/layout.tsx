"use client";
import ShareHeader from "@/_components/share/detail/ShareHeader";
import { useCommentStore } from "@/_store/tastingDetailStore";
import clsx from "clsx";
import React, { ReactNode } from "react";

export default function NoteDetailLayout({
  // children,
  note,
  comments,
}: {
  note: ReactNode;
  comments: ReactNode;
}) {
  const { showComments } = useCommentStore();
  return (
    <div className="w-full overflow-hidden pb-[100px]">
      <ShareHeader />
      {note}
      {comments}
    </div>
  );
}
