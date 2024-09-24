"use client";

import Loading from "@/_common/Loading";
import NotificationList from "@/_components/notification/NotificationList";
import NotificationTabButton from "@/_components/notification/NotificationTabButton";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import { Alarm } from "@/_types/user/alarm";
import { getNotificationList } from "@/app/api/notification/getNotificationList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteNotification } from "../api/notification/deleteNotification";
import NotificationDeleteAll from "@/_components/notification/NotificationDeleteAllModal";
import NotificationEditModal from "@/_components/notification/NotificationEditModal";
import { toast } from "react-toastify";

export default function Page() {
  const queryClient = useQueryClient(); // Get the query client for refetching data

  const {
    data: alarmList = [],
    isLoading,
    error,
  } = useQuery<Alarm[]>({
    queryKey: ["alarmList"],
    queryFn: getNotificationList,
  });

  const [selectedTab, setSelectedTab] = useState<string>("전체"); // State to track the selected tab
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAllNotiModalOpen, setDeleteAllNotiModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: (id) => {
      // Update the alarmList directly without refetching
      // Move this login to onSuccess in production
      try {
        const previousAlarms = queryClient.getQueryData<Alarm[]>(["alarmList"]);
        console.log(previousAlarms);
        if (previousAlarms) {
          queryClient.setQueryData(
            ["alarmList"],
            previousAlarms.filter(
              (notification: Alarm) => notification.id !== id,
            ),
          );
        }
      } catch (error) {
        console.error("Error in optimistic update:", error);
      }
    },
    onSuccess: (data, id) => {},
    onError: (error, id, context) => {
      console.error("Error in API:", error);
    },
    onSettled: () => {
      // Optional: Refetch the list, though you prefer not to
      // queryClient.invalidateQueries(["alarmList"]);
    },
  });

  const handleTabClick = (tabName: string) => {
    if (tabName === selectedTab) return;
    setSelectedTab(tabName);
    queryClient.setQueryData(["alarmList"], (prev: Alarm[]) =>
      prev.filter((notification: Alarm) => notification.type === tabName),
    );
  };

  const handleDelete = (id: number) => {
    mutation.mutate(id); // Call the delete mutation with the ID
  };

  const handleEditButton = () => {
    if (!isEditing) {
      setIsModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSelectionDelete = () => {
    setIsModalOpen(false);
    setIsEditing(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCloseDeleteAllNotiModal = () => setDeleteAllNotiModalOpen(false);

  const handleMarkAsRead = () => {};

  const handleDeleteAllNotification = () => {
    setDeleteAllNotiModalOpen(false);
    toast("모든 알림이 삭제되었어요.");
  };

  const handleOpenDeleteAllModal = () => {
    setIsModalOpen(false);
    setDeleteAllNotiModalOpen(true);
  };

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
          selectedTab={selectedTab} // Pass the selected tab to the child
          onTabClick={handleTabClick} // Pass the click handler
        />
        {alarmList?.length > 0 ? (
          <NotificationList
            alarmList={alarmList}
            isEditing={isEditing}
            onDelete={handleDelete} // Pass the delete handler
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <img
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
          handleMarkAsRead={handleMarkAsRead}
          handleSelectionDelete={handleSelectionDelete}
          handleOpenDeleteAllModal={handleOpenDeleteAllModal}
          handleCancel={handleCloseModal}
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
