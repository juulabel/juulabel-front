"use client";

import Loading from "@/_common/Loading";
import NotificationDeleteAll from "@/_components/notification/NotificationDeleteAllModal";
import NotificationEditModal from "@/_components/notification/NotificationEditModal";
import NotificationList from "@/_components/notification/NotificationList";
import NotificationTabButton from "@/_components/notification/NotificationTabButton";
import HeaderWithButton from "@/_components/share/life/HeaderWithButton";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  subscribeToNotifications,
  useDeleteAllNotifications,
  useDeleteNotification,
  useFetchNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "../api/notification/useNotifications";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<string>("전체");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAllNotiModalOpen, setDeleteAllNotiModalOpen] = useState(false);

  const {
    data: allNotifications = [],
    isLoading,
    error,
  } = useFetchNotifications();
  const { mutate: deleteAllNotifications } = useDeleteAllNotifications();
  const { mutate: deleteNotificationById } = useDeleteNotification();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  const filteredNotifications =
    selectedTab === "전체"
      ? allNotifications
      : allNotifications.filter((notification) => {
          switch (selectedTab) {
            case "공유공간":
              return ["POST_LIKE", "COMMENT_LIKE", "COMMENT"].includes(
                notification.notificationType,
              );
            case "전통주 추천":
              return notification.notificationType === "RECOMMENDATION";
            case "공지사항":
              return notification.notificationType === "ADMIN_NOTIFY";
            default:
              return true;
          }
        });

  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTabClick = useCallback((tabName: string) => {
    setSelectedTab(tabName);
  }, []);

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

  const handleDeleteNotificationById = useCallback(
    (id: number) => deleteNotificationById(id),
    [deleteNotificationById],
  );

  const handleDeleteAllNotifications = () => {
    deleteAllNotifications();
    handleCloseDeleteAllNotiModal();
    toast("모든 알림이 삭제되었어요.");
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllAsRead();
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
          selectedTab={selectedTab}
          onTabClick={handleTabClick}
        />
        {allNotifications?.length > 0 ? (
          <NotificationList
            alarmList={filteredNotifications}
            isEditing={isEditing}
            onDelete={handleDeleteNotificationById}
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
          handleMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />
      )}
      {deleteAllNotiModalOpen && (
        <NotificationDeleteAll
          modalTitle="모든 알림을 삭제하시겠어요?"
          confirmText="삭제하기"
          cancelText="닫기"
          handleConfirm={handleDeleteAllNotifications}
          handleCancel={handleCloseDeleteAllNotiModal}
        />
      )}
    </div>
  );
}
