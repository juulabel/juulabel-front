"use client";

import clsx from "clsx";
import React, { ReactNode } from "react";
import ShareHeader from "@/_components/share/detail/ShareHeader";
import { useCommentStore } from "@/_store/tastingDetailStore";

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
    <div className="w-full">
      <ShareHeader />
      {note}
      {comments}
    </div>
  );
}
