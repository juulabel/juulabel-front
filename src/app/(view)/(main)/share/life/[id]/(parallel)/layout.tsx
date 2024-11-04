"use client";
import ShareHeader from "@/_components/share/detail/ShareHeader";
import { useCommentStore } from "@/_store/tastingDetailStore";
import clsx from "clsx";
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
      <ShareHeader />
      {life}
      {comments}      
    </div>
  );
}
