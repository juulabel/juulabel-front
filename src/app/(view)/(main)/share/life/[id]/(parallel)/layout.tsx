"use client";

import React, { ReactNode } from "react";
import { useCommentStore } from "@/_store/tastingDetailStore";

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
