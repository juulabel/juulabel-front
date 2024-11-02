import ShareHeader from "@/_components/share/detail/ShareHeader";
import ShareNoteDetailBody from "@/_components/share/detail/ShareNoteDetailBody";
import ServerToast from "@/_components/share/error/ServerToast";
import { SearchParamProps } from "@/_types";
// import { redirect } from "next/navigation";

export default function NoteDetailPage({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/note" />;
  }

  return (
    <div className="w-full pb-[100px]">
      <ShareHeader />
      <ShareNoteDetailBody id={numberTypeId} />{" "}
    </div>
  );
}
