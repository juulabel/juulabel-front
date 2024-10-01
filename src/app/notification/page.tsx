"use client";

import { useCallback, useState } from "react";
import Loading from "@/_common/Loading";
import NotificationList from "@/_components/notification/NotificationList";
import NotificationTabButton from "@/_components/notification/NotificationTabButton";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import { Alarm } from "@/_types/user/alarm";
import { getNotificationList } from "@/app/api/notification/getNotificationList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  deleteAllNotification,
} from "../api/notification/deleteNotification";
import NotificationDeleteAll from "@/_components/notification/NotificationDeleteAllModal";
import NotificationEditModal from "@/_components/notification/NotificationEditModal";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Page() {
  const queryClient = useQueryClient();

  const {
    data: alarmList = [],
    isLoading,
    error,
  } = useQuery<Alarm[]>({
    queryKey: ["alarmList"],
    queryFn: getNotificationList,
  });

  const [selectedTab, setSelectedTab] = useState<string>("전체");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAllNotiModalOpen, setDeleteAllNotiModalOpen] = useState(false);

  // Optimized callback with memoization
  const handleTabClick = useCallback(
    (tabName: string) => {
      if (tabName === selectedTab) return;
      setSelectedTab(tabName);
      queryClient.setQueryData(
        ["alarmList"],
        (prev: Alarm[] | undefined) =>
          prev?.filter((notification) => notification.type === tabName) || [],
      );
    },
    [selectedTab, queryClient],
  );

  const selectionDeleteMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: (id) => {
      // Update the alarmList directly without refetching
      // Move this login to onSuccess in production
      try {
        const previousAlarms = queryClient.getQueryData<Alarm[]>(["alarmList"]);
        if (previousAlarms) {
          queryClient.setQueryData(
            ["alarmList"],
            previousAlarms.filter(
              (notification: Alarm) => notification.id !== id,
            ),
          );
        }
        return { previousAlarms };
      } catch (error) {
        console.error("Error in optimistic update:", error);
      }
    },
    onSuccess: (data, id) => {},
    onError: (error, id, context) => {
      console.error("Error in API:", error);
      if (context?.previousAlarms) {
        queryClient.setQueryData(["alarmList"], context.previousAlarms);
      }
    },
  });

  const allDeleteMutation = useMutation({
    mutationFn: deleteAllNotification,
    onMutate: () => {
      // Update the alarmList directly without refetching
      // Move this login to onSuccess in production
      queryClient.setQueryData(["alarmList"], []);
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Error in API:", error);
    },
  });

  const handleEditButton = () => {
    if (!isEditing) {
      setIsModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCloseDeleteAllNotiModal = () => setDeleteAllNotiModalOpen(false);

  const handleSelectionDelete = () => {
    handleCloseModal();
    setIsEditing(true);
  };

  const handleOpenDeleteAllModal = () => {
    handleCloseModal();
    setDeleteAllNotiModalOpen(true);
  };

  const handleDeleteAlarmById = useCallback(
    (id: number) => selectionDeleteMutation.mutate(id),
    [selectionDeleteMutation],
  );

  const handleDeleteAllNotification = () => {
    allDeleteMutation.mutate();
    handleCloseDeleteAllNotiModal();
    toast("모든 알림이 삭제되었어요.");
  };

  const handleMarkAsRead = () => {};

  if (isLoading) return <Loading />;
  if (error) return <div>Error : {error.message}</div>;

  return (
    <div className="h-full w-full max-w-[560px]">
      <div className="flex h-full flex-col">
        <HeaderWithButton
          title="알림"
          buttonType="notification"
          buttonName={!isEditing ? "편집" : "완료"}
          isActiveButton={true}
          onClick={handleEditButton}
        />
        <NotificationTabButton
          selectedTab={selectedTab}
          onTabClick={handleTabClick}
        />
        {alarmList?.length > 0 ? (
          <NotificationList
            alarmList={alarmList}
            isEditing={isEditing}
            onDelete={handleDeleteAlarmById}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Image
              width={56}
              height={56}
              className="pb-[8px]"
              src="/svg/zero_notification.svg"
              alt="알림 없음 표시 아이콘"
            />
            <div className="font-['Pretendard'] text-base font-medium leading-normal text-slate-700">
              알림이 없습니다.
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <NotificationEditModal
          handleSelectionDelete={handleSelectionDelete}
          handleOpenDeleteAllModal={handleOpenDeleteAllModal}
          handleCancel={handleCloseModal}
          handleMarkAsRead={handleMarkAsRead}
        />
      )}
      {deleteAllNotiModalOpen && (
        <NotificationDeleteAll
          modalTitle="모든 알림을 삭제하시겠어요?"
          confirmText="삭제하기"
          cancelText="닫기"
          handleConfirm={handleDeleteAllNotification}
          handleCancel={handleCloseDeleteAllNotiModal}
        />
      )}
    </div>
  );
}
