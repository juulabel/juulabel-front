"use client";
import ModalLayout from "@/_common/ModalLayout";
import Button from "@/_common/ui/Button";
import { useAuthorCheckStore } from "@/_store/tastingDetailStore";
import { getAlcoholType } from "@/app/api/common/getAlcoholType";
import { useDeleteTastingNote } from "@/app/api/tasting-note/deleteTastingNote";
import getNoteDetail from "@/app/api/tasting-note/getNoteDetail";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

interface IAlcoholType {
  id: number;
  name: string;
  image: string | null;
}

export default function ShareHeader() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [checkNotToLook, setCheckNotToLook] = useState<boolean>(false);
  const pathname = usePathname();

  const { isAuthor } = useAuthorCheckStore();
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCheckNotToLookOpen = () => {
    setCheckNotToLook(true);
  };

  const handleCheckNotToLookClose = () => {
    setCheckNotToLook(false);
  };

  const handleDontLookAtThePost = () => {
    toast("앞으로 해당 게시물이 보이지 않습니다.");
    router.push("/share/note");
  };

  if (pathname.endsWith("/comments")) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 z-10 flex h-[64px] w-full max-w-[560px] items-center justify-between border-b border-gray-300 bg-white px-3">
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push("/share/note");
          }}
        >
          <Image
            src={"/svg/left_arrow.svg"}
            width={32}
            height={32}
            alt="left"
          />
        </div>
        <div className="text-[18px] font-semibold text-[#334155]">
          전통주 시음노트
        </div>
        <div>
          {isAuthor && (
            <Image
              src={"/svg/three_dots_horizontal.svg"}
              width={28}
              height={28}
              alt="three dots"
              className={clsx("animate-fadeIn cursor-pointer")}
              onClick={handleModalOpen}
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <ModalLayout onClose={handleModalClose}>
          {/* <VisitorsModalContent
            handleModalClose={handleModalClose}
            handleCheckNotToLookOpen={handleCheckNotToLookOpen}
          /> */}
          <OwnerModalContent handleModalClose={handleModalClose} />
        </ModalLayout>
      )}
    </>
  );
}

function VisitorsModalContent({
  handleModalClose,
  handleCheckNotToLookOpen,
}: {
  handleModalClose: () => void;
  handleCheckNotToLookOpen: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3.5 px-3">
      <Button className="h-[40px] w-full rounded bg-primary-700 text-[14px] text-white">
        게시물 신고하기
      </Button>
      <Button
        className="h-[40px] w-full rounded bg-cool-grayscale-100 text-[14px] text-cool-grayscale-500"
        onClick={() => {
          handleModalClose(); // 기존 모달 닫고 신고 확인 모달 오픈함
          handleCheckNotToLookOpen();
        }}
      >
        이 게시물 보지 않기
      </Button>
      <Button
        variant="none"
        className="h-[40px] w-full text-[14px] font-semibold text-cool-grayscale-500"
        onClick={handleModalClose}
      >
        닫기
      </Button>
    </div>
  );
}

function OwnerModalContent({
  handleModalClose,
}: {
  handleModalClose: () => void;
}) {
  const router = useRouter();
  const params = useParams();
  const [cookie] = useCookies(["accessToken"]);
  const { deleteTastingNote } = useDeleteTastingNote();

  const postId = params.id;

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
    const tastingNoteId = params.id; // params에서 id를 가져옴
    if (tastingNoteId) {
      console.log("tastingNoteId", tastingNoteId);
      deleteTastingNote(Number(tastingNoteId));
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
        onClick={handleDeleteButtonClick}
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
    </div>
  );
}
