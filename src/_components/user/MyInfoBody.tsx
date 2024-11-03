import Modal from "@/_common/Modal";
import { IMyInfo } from "@/_types/user/myInfoData";
import { cn } from "@/_utils/commons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface IMyInfoBody {
  user: IMyInfo;
  setIsEditMode: (edited: boolean) => void; // Add this line
}

export default function MyInfoBody({ user, setIsEditMode }: IMyInfoBody) {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(true);
  const [signOutModalOpen, setSignOutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user !== undefined) {
      setIsNotificationOn(user?.isNotificationsAllowed);
    }
  }, [user]);

  const handlePushNotification = () => {
    setIsNotificationOn(!isNotificationOn);
  };
  const handleSignOut = () => {
    setSignOutModalOpen(true);
  };

  const handleDeleteAccount = () => {
    router.push("/user/delete-account");
  };
  return (
    <div className="mx-[4%]">
      <div className="text-xl font-bold leading-7 text-slate-800">
        {user.nickname}
      </div>
      <div className="text-sm font-normal leading-[21px] text-slate-500">
        {user.email}
      </div>

      <button
        onClick={() => setIsEditMode(true)}
        className="my-4 inline-flex h-[37px] w-full items-center justify-center gap-2.5 rounded bg-slate-100 px-3 py-2"
      >
        <p className="text-center text-sm font-bold leading-[21px] text-slate-500">
          내 정보 수정하기
        </p>
      </button>

      <div className="h-1 bg-slate-100" />

      <div className="flex py-4">
        <div>
          <div className="mb-1 text-base font-bold leading-normal text-slate-700">
            PUSH 알림 설정
          </div>
          <div className="text-sm font-normal leading-[21px] text-slate-500">
            다른 사용자가 댓글, 좋아요를 달았거나 팔로우를 걸었을 때 알림을
            보내드려요
          </div>
        </div>

        <button
          onClick={handlePushNotification}
          className="relative ml-auto h-6 w-11"
        >
          <div
            className={cn(
              "absolute left-0 top-0 h-6 w-11 rounded-[13.5px] transition-colors duration-300",
              isNotificationOn ? "bg-[#ff823b]" : "bg-slate-200",
            )}
          />
          <div
            className={cn(
              "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all duration-300 ease-in-out",
              isNotificationOn ? "left-[23px]" : "left-[3px]",
            )}
          />
        </button>
      </div>

      <button
        onClick={handleSignOut}
        className="inline-flex w-full border-t-[1px] border-cool-grayscale-100 py-4"
      >
        <div className="text-sm font-medium leading-[21px] text-slate-700">
          로그아웃
        </div>
      </button>

      <button
        onClick={handleDeleteAccount}
        className="inline-flex w-full border-t-[1px] border-cool-grayscale-100 py-4"
      >
        <div className="text-sm font-medium leading-[21px] text-slate-400">
          회원 탈퇴
        </div>
      </button>
      {signOutModalOpen && (
        <Modal
          modalTitle="정말로 로그아웃 하시겠어요?"
          primaryBtnText="확인"
          handlePrimaryBtn={() => {
            removeCookie(cookies.accessToken);
            setSignOutModalOpen(false);
            router.push("/");
          }}
          cancelText="취소"
          handleCancel={() => {
            setSignOutModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
