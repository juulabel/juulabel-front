import Modal from "@/_common/Modal";
import { IMyInfo } from "@/_types";
import { cn } from "@/_utils/commons";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import BadgeInfoModal from "../share/BadgeInfoModal";

interface IMyInfoBody {
  user: IMyInfo;
  setIsEditMode: (edited: boolean) => void;
}

export default function MyInfoBody({ user, setIsEditMode }: IMyInfoBody) {
  const router = useRouter();
  const [, , removeCookie] = useCookies(["accessToken"]);
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(true);
  const [signOutModalOpen, setSignOutModalOpen] = useState<boolean>(false);
  const [isBadgeInfoModalOpen, setIsBadgeInfoModalOpen] =
    useState<boolean>(false);

  // Memoize image paths
  const imagePaths = useMemo(
    () => ({
      badgeIcon: `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/icon-badge.svg`,
      rightArrow: `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/orange_right_arrow.svg`,
      kisaBadge: `${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/images/kisa-badge.png`,
    }),
    [],
  );

  useEffect(() => {
    if (user) {
      setIsNotificationOn(user.isNotificationsAllowed);
    }
  }, [user]);

  const handlePushNotification = useCallback(() => {
    setIsNotificationOn((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(() => {
    setSignOutModalOpen(true);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    router.push("/user/delete-account");
  }, [router]);

  const handleBadgeInfoModalToggle = useCallback(() => {
    setIsBadgeInfoModalOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    removeCookie("accessToken", { path: "/" });
    setSignOutModalOpen(false);
    router.push("/");
  }, [removeCookie, router]);

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

      {!user.hasBadge && (
        <div
          className="mt-2 flex flex-col items-center rounded-lg bg-slate-50 py-[8px] hover:cursor-pointer"
          onClick={handleBadgeInfoModalToggle}
        >
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-slate-500">
              보유중인 뱃지가 없어요!
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={imagePaths.badgeIcon}
              alt="뱃지"
              width={16}
              height={16}
            />
            <div className="text-sm font-bold text-orange-400">
              뱃지 신청하기
            </div>
            <Image
              src={imagePaths.rightArrow}
              alt="right arrow"
              width={16}
              height={16}
            />
          </div>
        </div>
      )}
      {user.hasBadge && (
        <>
          <div className="w-full rounded-t-lg border border-slate-300 bg-slate-50 p-4">
            <div className="flex items-center justify-center gap-1">
              <Image
                src={imagePaths.kisaBadge}
                alt="뱃지"
                width={40}
                height={40}
              />
              <div className="flex items-center">
                <span className="text-sm font-bold leading-tight text-slate-700">
                  KISA뱃지
                </span>
                <span className="text-sm font-medium leading-tight text-slate-700">
                  를 보유하고 있어요.
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBadgeInfoModalToggle}
            className="w-full rounded-b-lg border border-t-0 border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800"
          >
            뱃지 자세히 보기
          </button>
        </>
      )}

      <div className="mt-[16px] h-1 bg-slate-100" />

      {/* <div className="flex py-4">
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
      </div> */}

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
          handlePrimaryBtn={handleLogout}
          cancelText="취소"
          handleCancel={() => setSignOutModalOpen(false)}
        />
      )}
      {isBadgeInfoModalOpen && (
        <BadgeInfoModal
          setIsBadgeInfoModalOpen={setIsBadgeInfoModalOpen}
          showApplyButton={!user.hasBadge}
        />
      )}
    </div>
  );
}
