"use client";
import { useCommentStore } from "@/_store/tastingDetailStore";
import CommentsBody from "./CommentsBody";
import CommentsHeader from "./CommentsHeader";
import clsx from "clsx";
import { useEffect } from "react";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";

interface Props {
  id: number;
}

export default function CommentsPage({ id }: Props) {
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
      {isCommentsPageVisible === "Y" && <CommentsHeader />}

      <CommentsBody id={id} />
    </section>
  );
}
