"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import { useCommentStore } from "@/_store/tastingDetailStore";
import CommentsBody from "./CommentsBody";
import CommentsHeader from "./CommentsHeader";

interface Props {
  id: number;
  isLife?: boolean;
}

export default function CommentsPage({ id, isLife }: Props) {
  const { isCommentsPageVisible } = useCommentsPageStore();
  useEffect(() => {
    if (isCommentsPageVisible === "Y") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCommentsPageVisible]);

  return (
    <section className={clsx("z-50 h-full w-full bg-white", {})}>
      {isCommentsPageVisible === "Y" && <CommentsHeader isLife={isLife} />}

      <CommentsBody id={id} isLife={isLife} />
    </section>
  );
}
