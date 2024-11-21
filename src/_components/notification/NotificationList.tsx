"use client";

import { INotificationSummary } from "@/_types/notification";
import { dateViewKoreanFull } from "@/_utils/time";
import Image from "next/image";

const NotificationTypeLabels: { [key: string]: string } = {
  POST_LIKE: "공유공간",
  COMMENT_LIKE: "공유공간",
  COMMENT: "공유공간",
  RECOMMENDATION: "전통주 추천",
  ADMIN_NOTIFY: "공지사항",
};

// 알림 타입을 문자열로 변환하는 함수
const getNotificationTypeLabel = (type: string): string => {
  return NotificationTypeLabels[type] || "알림";
};

interface INotificationList {
  alarmList: INotificationSummary[];
  isEditing: boolean;
  onDelete: (id: number) => void; // Accept the delete handler as a prop
}

export default function NotificationList({
  alarmList,
  isEditing,
  onDelete, // Destructure onDelete
}: INotificationList) {
  return (
    <>
      {alarmList.map((notification: INotificationSummary, index: number) => (
        <div
          key={index}
          className="flex cursor-pointer items-center justify-start gap-2 p-4 transition hover:bg-cool-grayscale-100"
        >
          <Image
            width={40}
            height={40}
            className={`rounded-full ${notification.isRead && "grayscale"}`}
            src={
              notification.notificationType == "ADMIN_NOTIFY"
                ? "/svg/announcement_alarm.svg"
                : "/svg/announcement_alarm.svg" // 유저 프로필 사진으로 변경해야 함
            }
            alt="알림 프로필 사진"
          />

          <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
            <div className="inline-flex items-center justify-start gap-2">
              <div
                className={`text-sm font-normal leading-[21px] ${
                  notification.isRead ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {getNotificationTypeLabel(notification.notificationType)}
              </div>
              <Image
                width={2}
                height={9}
                src="/svg/stroke.svg"
                alt="| 아이콘"
              />
              <div
                className={`text-sm font-normal leading-[21px] ${
                  notification.isRead ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {dateViewKoreanFull(notification.createdAt)}
              </div>
            </div>
            <div
              className={`self-stretch text-sm font-medium leading-[21px] ${
                notification.isRead ? "text-slate-400" : "text-slate-700"
              }`}
            >
              {notification.content}
            </div>
          </div>
          {isEditing && ( // Show the delete button only if isEditing is true
            <button
              className="flex h-6 w-6 items-center justify-center rounded-3xl bg-cool-grayscale-500 p-[3px] shadow"
              onClick={() => onDelete(notification.id)} // Call the delete handler
            >
              <Image
                width={18}
                height={18}
                src="/svg/white_close_icon.svg"
                alt="닫기 아이콘"
              />
            </button>
          )}
        </div>
      ))}
    </>
  );
}
