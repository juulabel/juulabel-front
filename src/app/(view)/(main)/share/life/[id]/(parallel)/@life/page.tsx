"use client";
import WarningModal from "@/_components/notification/WarningModal";
import CommentFooter from "@/_components/reaction/CommentFooter";
import EditModal from "@/_components/share/EditModal";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import LifeViewer from "@/_components/share/life/LifeViewer";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { deleteDailyLife } from "@/app/api/life/deleteDailyLife";
import { getLifeDetail } from "@/app/api/life/getLifeDetail";
import { useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { Inputs } from "../../../write/page";
import { SearchParamProps } from "@/_types";
import { useAuthorCheckStore } from "@/_store/tastingDetailStore";
import useMemberStore from "@/_store/memberStore";
import VisitorsModalContent from "@/_components/report/VisitorsModalContent";
import ModalLayout from "@/_common/ModalLayout";

function LifeDetailPage({ params }: SearchParamProps) {
  const router = useRouter();
  const id = params.id;
  const [cookie] = useCookies(["accessToken"]);
  const { isAuthor, setIsAuthor } = useAuthorCheckStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  useEffect(() => {
    const message = localStorage.getItem("showToast");
    if (message) {
      toast(message);
      localStorage.removeItem("showToast");
    }
  }, []);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const { setMemberInfo } = useMemberStore();

  const [
    { data, isFetching: isLoadingLife, error },
    { data: userData, isFetching: isLoadingUser, error: userError },
  ] = useQueries({
    queries: [
      {
        queryKey: ["lifeDetail", id],
        queryFn: () => getLifeDetail({ id: Number(id) }),
      },
      {
        queryKey: ["currentUserInfo"],
        queryFn: () => getMyInfo(),
      },
    ],
  });

  useEffect(() => {
    if (data && userData) {
      setIsAuthor(
        data?.result.dailyLifeDetailInfo.memberInfo.memberId ===
          userData.memberId,
      );

      setMemberInfo(userData);
    }
  }, [data, userData]);

  const handleDeleteConfirm = useCallback(async () => {
    const isSuccess = await deleteDailyLife(cookie.accessToken, id);
    setDeleteModalOpen(false);
    if (isSuccess) {
      router.back();
      toast("일상생활 게시물이 삭제되었어요.");
    } else {
      toast("내부 서버 오류");
    }
  }, [cookie.accessToken, id, router]);

  const handleEditBtn = useCallback(() => {
    if (!data) return;

    const input: Inputs = {
      title: data.result.dailyLifeDetailInfo.title,
      content: data.result.dailyLifeDetailInfo.content,
      isPrivate: false,
      files: [],
      imageUrls: data.result.imageInfo.imageUrlList,
    };

    sessionStorage.setItem("editLifeData", JSON.stringify(input));
    router.push(`/share/life/write?dailyLifeId=${id}`);
  }, [data, id, router]);

  // 임시 에러 및 로딩 컴포넌트
  if (isLoadingUser || isLoadingLife) {
    return <div>Loading...</div>;
  }
  if (userError || error) return toast(userError?.message ?? error?.message);
  if (!data) {
    return null;
  }

  const {
    dailyLifeDetailInfo: {
      title,
      content,
      memberInfo: { memberId, nickname, profileImage },
      createdAt,
      likeCount,
      commentCount,
      isLiked,
    },
    imageInfo: { imageUrlList, imageCount },
  } = data.result;

  return (
    <>
      <HeaderWithButton
        title="전통주 일상생활"
        buttonType="meatballs"
        titleLink="/share/life"
        isActiveButton={userData.memberId == memberId}
        onClick={() => {
          setModalOpen(true);
        }}
      />
      <div className="h-dvh overflow-y-scroll scrollbar-hide">
        <LifeViewer
          title={title}
          content={content}
          nickname={nickname}
          authorId={memberId}
          profileImage={profileImage}
          createdAt={createdAt}
          imageUrlList={imageUrlList}
          imageCount={imageCount}
        />
      </div>
      <CommentFooter info={data.result.dailyLifeDetailInfo} dailyLifeId={id} />
      {modalOpen &&
        (isAuthor ? (
          <EditModal
            handleEdit={handleEditBtn}
            handleDelete={() => {
              setModalOpen(false);
              setDeleteModalOpen(true);
            }}
            handleCancel={() => setModalOpen(false)}
          />
        ) : (
          <ModalLayout onClose={handleModalClose}>
            <VisitorsModalContent
              targetId={id}
              type="일상생활"
              text="게시글"
              handleModalClose={handleModalClose}
            />
          </ModalLayout>
        ))}

      {deleteModalOpen && (
        <WarningModal
          modalTitle="게시물을 삭제하시겠어요?"
          confirmText="삭제하기"
          cancelText="닫기"
          handleConfirm={handleDeleteConfirm}
          handleCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
export default LifeDetailPage;
