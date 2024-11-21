import CommentsPage from "@/_components/share/detail/comments/CommentsPage";
import ServerToast from "@/_components/share/error/ServerToast";
import { SearchParamProps } from "@/_types";

export default function CommentsPageServer({ params }: SearchParamProps) {
  const numberTypeId = Number(params.id);

  if (!numberTypeId || isNaN(numberTypeId)) {
    return <ServerToast text="잘못된 접근입니다." redirectPath="/share/life" />;
  }

  return (
    <div className="w-full max-w-[560px]">
      <CommentsPage id={numberTypeId} />
    </div>
  );
}
