"use client";
import WarningModal from "@/_components/notification/\bWarningModal";
import CommentFooter from "@/_components/reaction/CommentFooter";
import EditModal from "@/_components/share/EditModal";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import LifeViewer from "@/_components/share/life/LifeViewer";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { deleteDailyLife } from "@/app/api/life/deleteDailyLife";
import { getLifeDetail } from "@/app/api/life/getLifeDetail";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { Inputs } from "../../../write/page";
import { SearchParamProps } from "@/_types";

function LifeDetailPage({ params }: SearchParamProps) {
  const router = useRouter();
  const id = params.id;
  const searchParams = useSearchParams();
  const posted = searchParams.get("posted");
  const editMode = searchParams.get("editMode");
  const [cookie] = useCookies(["accessToken"]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [
    { data, isFetching: isLoadingLife, error },
    { data: user, isFetching: isLoadingUser, error: userError },
  ] = useQueries({
    queries: [
      {
        queryKey: ["lifeDetail", id],
        queryFn: () => getLifeDetail(cookie.accessToken, id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["my-info"],
        queryFn: () => getMyInfo(cookie.accessToken),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      },
    ],
  });

  useEffect(() => {
    if (posted === "true") {
      if (editMode) {
        toast("일상생활 수정이 완료되었어요.");
      } else {
        toast("일상생활 작성이 완료되었어요.");
      }
    }
  });

  const handleDeleteConfirm = async () => {
    const isSuccess = await deleteDailyLife(cookie.accessToken, id);
    if (isSuccess) {
      setDeleteModalOpen(false);
      router.back();
      toast("일상생활 게시물이 삭제되었어요.");
    } else {
      setDeleteModalOpen(false);
      toast("내부 서버 오류");
    }
  };
  const handleEditBtn = () => {
    const input: Inputs = {
      title: data.result.dailyLifeDetailInfo.title,
      content: data.result.dailyLifeDetailInfo.content,
      isPrivate: false,
      files: [],
      imageUrls: data.imageInfo.imageUrlList,
    };

    sessionStorage.setItem("editLifeData", JSON.stringify(input));

    router.push(`/share/life/write?dailyLifeId=${id}`);
  };

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
        isActiveButton={user.memberId == memberId}
        onClick={() => {
          setEditModalOpen(true);
        }}
      />
      <div className="h-dvh overflow-y-scroll pb-[62px] scrollbar-hide">
        <LifeViewer
          title={title}
          content={content}
          nickname={nickname}
          profileImage={profileImage}
          createdAt={createdAt}
          imageUrlList={imageUrlList}
          imageCount={imageCount}
        />
      </div>
      <CommentFooter info={data.result.dailyLifeDetailInfo} dailyLifeId={id} />
      {editModalOpen && (
        <EditModal
          handleEdit={handleEditBtn}
          handleDelete={() => {
            setEditModalOpen(false);
            setDeleteModalOpen(true);
          }}
          handleCancel={() => setEditModalOpen(false)}
        />
      )}
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
