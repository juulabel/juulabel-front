import ShareNoteForTraditionalLiquorBody from "@/_components/share/detail/ShareNoteForTraditionalLiquorBody";
import ShareNoteForTraditionalLiquorLayout from "@/_components/share/detail/ShareNoteForTraditionalLiquorLayout";
import ServerToast from "@/_components/share/error/ServerToast";
import { SearchParamProps } from "@/_types";

export default function NoteFilterPage({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return (
      <ServerToast text={"잘못된 접근입니다."} redirectPath={"/share/note"} />
    );
  }

  return (
    <ShareNoteForTraditionalLiquorLayout id={numberTypeId}>
      <ShareNoteForTraditionalLiquorBody id={numberTypeId} />
    </ShareNoteForTraditionalLiquorLayout>
  );
}
