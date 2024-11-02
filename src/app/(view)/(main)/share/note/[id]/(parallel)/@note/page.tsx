import LifeCarousel from "@/_components/share/life/LifeCarousel";
import ShareDetailNoteImageBox from "@/_components/share/detail/ShareDetailNoteImageBox";
import ShareDetailReviewBox from "@/_components/share/detail/ShareDetailReviewBox";
import ShareHeader from "@/_components/share/detail/ShareHeader";
import ShareNoteInfoBox from "@/_components/share/detail/ShareNoteInfoBox";
import { SearchParamProps } from "@/_types";
import LikeCommentFooter from "@/_components/share/LikeCommentFooter";
import ShareNoteDetailBody from "@/_components/share/detail/ShareNoteDetailBody";
import ServerToast from "@/_components/share/error/ServerToast";
// import { redirect } from "next/navigation";

export default function NoteDetailPage({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/note" />;
  }

  return <ShareNoteDetailBody id={numberTypeId} />;
}
