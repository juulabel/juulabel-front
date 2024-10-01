"use client";

import { Alarm } from "@/_types/user/alarm";
import { dateViewKoreanFull } from "@/_utils/time";
import Image from "next/image";

interface INotificationList {
  alarmList: Alarm[];
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
      {alarmList.map((notification: Alarm, index: number) => (
        <div
          key={index}
          className="flex cursor-pointer items-center justify-start gap-2 p-4 transition hover:bg-cool-grayscale-100"
        >
          <Image
            width={40}
            height={40}
            className={`rounded-full ${notification.isRead && "grayscale"}`}
            src={
              notification.type == "공지사항"
                ? "/svg/announcement_alarm.svg"
                : "https://juulabel.s3.ap-northeast-2.amazonaws.com/member/2024/07/27/a348614bd66d440dimage"
            }
            alt="알림 프로필 사진"
          />

          <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
            <div className="inline-flex items-center justify-start gap-2">
              <div
                className={`font-['Pretendard'] text-sm font-normal leading-[21px] ${
                  notification.isRead ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {notification.type}
              </div>
              <Image
                width={2}
                height={9}
                src="/svg/stroke.svg"
                alt="| 아이콘"
              />
              <div
                className={`font-['Pretendard'] text-sm font-normal leading-[21px] ${
                  notification.isRead ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {dateViewKoreanFull(notification.createdAt)}
              </div>
            </div>
            <div
              className={`self-stretch font-['Pretendard'] text-sm font-medium leading-[21px] ${
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
