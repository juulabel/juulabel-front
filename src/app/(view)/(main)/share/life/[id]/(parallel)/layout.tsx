"use client";
import { useCommentStore } from "@/_store/tastingDetailStore";
import React, { ReactNode } from "react";

export default function LifeDetailLayout({
  // children,
  life,
  comments,
}: {
  life: ReactNode;
  comments: ReactNode;

  // children: ReactNode;
}) {
  const { showComments } = useCommentStore();
  return (
    <div className="w-full overflow-hidden pb-[100px]">
      {life}
      {comments}
    </div>
  );
}
