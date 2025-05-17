"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import { useDeleteTastingNote } from "@/app/api/tasting-note/deleteTastingNote";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import Button from "@/_common/ui/Button";
import { IAlcoholType } from "@/_types/tasting-note/officialData";
import WarningModal from "../notification/WarningModal";

export default function OwnerModalContent({
  postId,
  handleModalClose,
}: {
  postId: string;
  handleModalClose: () => void;
}) {
  const router = useRouter();
  const [cookie] = useCookies(["accessToken"]);
  const { deleteTastingNote } = useDeleteTastingNote();
  const [deleteCheckModalOpen, setDeleteCheckModalOpen] =
    useState<boolean>(false);

  const {
    data: tastingNoteDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tastingNote", postId],
    queryFn: () =>
      getNoteDetail({
        token: cookie.accessToken,
        id: Number(postId),
      }),
  });

  const { data: alcoholTypeData } = useQuery({
    queryKey: ["alcoholType"],
    queryFn: getAlcoholType,
    select: (data) => data.alcoholTypeInfos,
  });

  const handleEditButtonClick = async () => {
    if (tastingNoteDetail) {
      // Official 데이터인 경우
      if (tastingNoteDetail.result.alcoholicDrinksInfo.isOfficialData) {
        const matchedType = alcoholTypeData.find(
          (type: IAlcoholType) =>
            type.name ===
            tastingNoteDetail.result.tastingNoteDetailInfo.alcoholTypeName,
        );

        const alcoholicDrinksId =
          tastingNoteDetail.result.alcoholicDrinksInfo.alcoholicDrinksId;
        const name =
          tastingNoteDetail.result.tastingNoteDetailInfo.alcoholicDrinksName;
        const alcoholContent =
          tastingNoteDetail.result.tastingNoteDetailInfo.alcoholContent;
        const alcoholTypeId = matchedType ? matchedType.id : 0;
        const alcoholTypeName =
          tastingNoteDetail.result.tastingNoteDetailInfo.alcoholTypeName;
        const brewery =
          tastingNoteDetail.result.tastingNoteDetailInfo.breweryName;
        const breweryLocation =
          tastingNoteDetail.result.tastingNoteDetailInfo.breweryRegion;

        router.push(
          `/share/note/${postId}/edit?alcoholicDrinksId=${alcoholicDrinksId}&productName=${encodeURIComponent(
            name,
          )}&alcoholContent=${encodeURIComponent(
            alcoholContent,
          )}&alcoholTypeId=${encodeURIComponent(
            alcoholTypeId,
          )}&alcoholTypeName=${encodeURIComponent(alcoholTypeName)}&brewery=${
            brewery ? encodeURIComponent(brewery) : ""
          }&breweryLocation=${
            breweryLocation ? encodeURIComponent(breweryLocation) : ""
          }`,
        );
      } else {
        // Unofficial 데이터인 경우
        router.push(`/share/note/${postId}/edit`);
      }
    } else {
      toast("시음노트 ID를 찾을 수 없습니다.");
    }
  };

  const handleDeleteButtonClick = async () => {
    handleModalClose();
    if (postId) {
      deleteTastingNote(Number(postId));
    } else {
      toast("시음노트 ID를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button
        variant="primary"
        className="h-[40px] w-full rounded text-[14px]"
        onClick={handleEditButtonClick}
      >
        게시물 수정하기
      </Button>
      <Button
        variant="secondary"
        className="h-[40px] w-full rounded text-[14px] text-cool-grayscale-500"
        onClick={() => setDeleteCheckModalOpen(true)}
      >
        게시물 삭제하기
      </Button>
      <Button
        variant="none"
        className="h-[40px] w-full text-[14px] font-semibold text-cool-grayscale-500"
        onClick={handleModalClose}
      >
        닫기
      </Button>
      {deleteCheckModalOpen && (
        <WarningModal
          className="animate-modalOpen"
          modalTitle="게시물을 삭제하시겠어요?"
          confirmText="삭제하기"
          cancelText="닫기"
          handleConfirm={handleDeleteButtonClick}
          handleCancel={() => {
            setDeleteCheckModalOpen(false);
            handleModalClose();
          }}
        />
      )}
    </div>
  );
}
