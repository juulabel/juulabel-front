import Comments from "@/_components/share/detail/comments/Comments";
import CommentsBody from "@/_components/share/detail/comments/CommentsBody";
import CommentsHeader from "@/_components/share/detail/comments/CommentsHeader";
import CommentsPage from "@/_components/share/detail/comments/CommentsPage";
import ServerToast from "@/_components/share/error/ServerToast";
import { SearchParamProps } from "@/_types";
import Image from "next/image";

export default function CommentsPageServer({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/note" />;
  }

  return (
    <div className="w-full max-w-[560px]">
      <CommentsPage id={numberTypeId} />
    </div>
  );
}
