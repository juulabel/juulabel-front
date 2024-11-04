"use client";

import Loading from "@/_common/Loading";
import Modal from "@/_common/Modal";
import UserHeader from "@/_components/user/UserHeader";
import { IMyInfo } from "@/_types/user/myInfoData";
import { cn } from "@/_utils/commons";
import getMyInfo from "@/app/api/auth/getMyInfo";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import EditMyInfo from "@/_components/user/EditMyInfo";
import ConfirmModal from "@/_common/ConfirmModal";
import MyInfoBody from "@/_components/user/MyInfoBody";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);
  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery<IMyInfo>({
    queryKey: ["my-ifno"],
    queryFn: () => getMyInfo(cookies.accessToken),
  });

  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editCancelModalOpen, setEditCancelModalOpen] =
    useState<boolean>(false);
  const [hasEdited, setHasEdited] = useState<boolean>(false);

  const handleBackButton = () => {
    if (isEditMode) {
      if (hasEdited) {
        setEditCancelModalOpen(true);
      } else {
        setIsEditMode(false);
      }
    } else {
      router.back();
    }
  };

  console.log(user);
  

  if (isLoadingUser) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="h-full w-full max-w-[560px]">
      {user && (
        <>
          <UserHeader
            title={isEditMode ? "내 정보 수정하기" : "내 정보"}
            handleBackButton={handleBackButton}
            bottomBorder={false}
          />
          {!isEditMode ? (
            <MyInfoBody user={user} setIsEditMode={setIsEditMode} />
          ) : (
            <>
              <EditMyInfo
                user={user}
                hasEdited={hasEdited}
                setHasEdited={setHasEdited}
              />
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
            </>
          )}
        </>
      )}
    </div>
  );
}
