import Image from "next/image";

interface ICommentFooter {
  likeCount: number;
  commentCount: number;
}

export default function CommentFooter({
  likeCount,
  commentCount,
}: ICommentFooter) {
  return (
    <>
      <div
        className="fixed bottom-[47px] z-10 h-4 w-full max-w-[560px]"
        style={{ boxShadow: "0px -4px 32px rgba(0, 0, 0, 0.07)" }}
      />
      <footer className="fixed bottom-0 z-10 flex h-[62px] w-full max-w-[560px] items-center justify-between space-x-2 bg-white p-4 px-4 py-2 text-cool-grayscale-500">
        <div className="flex items-center space-x-2">
          <Image
            src="/svg/like.svg"
            alt="좋아요 아이콘"
            width={22}
            height={22}
          />
          <div className="text-sm">
            <strong className="font-bold text-cool-grayscale-500">
              {likeCount}명
            </strong>
            이 좋아합니다.
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Image
            src="/images/icons/comment.png"
            alt="댓글 아이콘"
            width={26}
            height={22}
          />
          <div className="text-sm">{commentCount}</div>
        </div>
      </footer>
    </>
  );
}
