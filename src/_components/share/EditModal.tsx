import Button from "@/_common/ui/Button";

interface IEditModal {
  handleEdit: () => void;
  handleDelete: () => void;
  handleCancel: () => void;
}

export default function EditModal({
  handleEdit,
  handleDelete,
  handleCancel,
}: IEditModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="inline-flex h-[179px] w-[91%] max-w-[560px] flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6">
        <Button
          variant="primary"
          className="h-[40px] w-full rounded text-[14px]"
          onClick={handleEdit}
        >
          게시물 수정하기
        </Button>
        <Button
          variant="secondary"
          className="h-[40px] w-full rounded text-[14px] text-cool-grayscale-500"
          onClick={handleDelete}
        >
          게시물 삭제하기
        </Button>
        <Button
          variant="none"
          className="h-[40px] w-full text-[14px] font-semibold text-cool-grayscale-500"
          onClick={handleCancel}
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
