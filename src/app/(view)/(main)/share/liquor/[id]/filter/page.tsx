import { SearchParamProps } from "@/_types";
import ServerToast from "@/_components/share/error/ServerToast";
import ShareNoteForTraditionalLiquorLayout from "@/_components/share/detail/ShareNoteForTraditionalLiquorLayout";
import ShareNoteForTraditionalLiquorBody from "@/_components/share/detail/ShareNoteForTraditionalLiquorBody";

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
