"use client";

import Loading from "@/_common/Loading";
import UserHeader from "@/_components/user/UserHeader";
import { IMyInfo } from "@/_types/user/myInfoData";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import EditMyInfo from "@/_components/user/EditMyInfo";
import ConfirmModal from "@/_common/ConfirmModal";
import MyInfoBody from "@/_components/user/MyInfoBody";

export default function Page() {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editCancelModalOpen, setEditCancelModalOpen] =
    useState<boolean>(false);
  const [hasEdited, setHasEdited] = useState<boolean>(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IMyInfo>({
    queryKey: ["my-info"],
    queryFn: () => getMyInfo(cookies.accessToken),
  });

  const handleBackButton = () => {
    if (isEditMode && hasEdited) {
      setEditCancelModalOpen(true);
    } else if (isEditMode) {
      setIsEditMode(false);
    } else {
      router.back();
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="h-full w-full max-w-[560px]">
      <UserHeader
        title={isEditMode ? "내 정보 수정하기" : "내 정보"}
        handleBackButton={handleBackButton}
        bottomBorder={false}
      />

      {!isEditMode ? (
        <MyInfoBody user={user} setIsEditMode={setIsEditMode} />
      ) : (
        <EditMyInfo
          user={user}
          hasEdited={hasEdited}
          setHasEdited={setHasEdited}
          setIsEditMode={setIsEditMode}
        />
      )}

      {editCancelModalOpen && (
        <ConfirmModal
          modalTitle="프로필의 변경사항이 저장되지 않았어요"
          modalDescription="그래도 나가시겠어요?"
          confirmText="저장하지 않고 나가기"
          cancelText="취소"
          handleConfirm={() => {
            setEditCancelModalOpen(false);
            setIsEditMode(false);
          }}
          handleCancel={() => setEditCancelModalOpen(false)}
        />
      )}
    </div>
  );
}
