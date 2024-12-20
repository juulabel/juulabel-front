"use client";
import useReplyComponentStore from "@/_store/replyComponentStore";
import clsx from "clsx";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import ReplyList from "./ReplyList";
import { useCommentsPageStore } from "@/_store/tastingCommentsPageStore";
import DeletedComments from "./DeletedComments";
import useMemberStore from "@/_store/memberStore";

export default function ReplyWithComment() {
  const { isCommentsPageVisible } = useCommentsPageStore();
  const { memberInfo } = useMemberStore();
  const {
    isOpen: replyComponentIsOpen,
    onClose,
    commentInfo,
    postId,
  } = useReplyComponentStore();
  // const {} = useCommentsPageStore();
  // 애니메이션 첫 교화때문에 놔둠
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 10);

    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  // 데이
  if (!commentInfo || !postId) {
    return null;
  }
  

  return (
    <section
      className={clsx(
        "fixed bottom-0 z-40 h-full w-full max-w-[560px] bg-white pb-[85px] pt-[64px] transition-transform duration-700",
        {
          "animate-slideDown": !replyComponentIsOpen && isMounted, // 닫힐 때는 애니메이션 적용
          "animate-slideUp overflow-y-auto": replyComponentIsOpen, // 열릴 때는 애니메이션 적용
          hidden: !isMounted || isCommentsPageVisible !== "Y",
        },
      )}
    >
      <div className="border-b-[2px] border-cool-grayscale-200">
        {commentInfo.isDeleted ? (
          <DeletedComments postId={postId} commentInfo={commentInfo} />
        ) : (
          <Comments
            postId={postId}
            commentInfo={commentInfo}
            isAuthor={memberInfo?.memberId === commentInfo.memberInfo.memberId}
          />
        )}
      </div>
      <Gap />

      <ReplyList parentCommentId={commentInfo.commentId} postId={postId} />
    </section>
  );
}

function Gap() {
  return <div className="h-[8px] w-full bg-cool-grayscale-100"></div>;
}
