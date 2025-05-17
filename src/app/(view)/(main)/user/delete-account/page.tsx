"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { deleteUser } from "@/app/api/user/deleteUser";
import UserHeader from "@/_components/user/UserHeader";
import BottomButton from "@/_common/BottomButton";
import Checkbox from "@/_common/Checkbox";
import ConfirmModal from "@/_common/ConfirmModal";
import { cn } from "@/_utils/commons";

export default function Page() {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [etcReport, setEtcReport] = useState<string>("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(
    "제공되는 정보가 기대에 미치지 않음",
  );
  const router = useRouter();

  const handleEtcReport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEtcReport(event.target.value);
  };

  const handleFinalCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
  };

  const deleteList = [
    "제공되는 정보가 기대에 미치지 않음",
    "이용이 불편하고 비번한 버그나 오류 발생",
    "타사이트에서 더 나은 서비스를 제공",
    "피드백을 제공했으나 반영되지 않음",
    "탈퇴 후 재가입",
    "이용빈도 낮음",
    "기타(직접 입력)",
  ];

  const handleCheckboxChange = (report: string) => {
    setSelectedReason(report);
  };

  const handleDeleteBtn = async () => {
    const reason =
      selectedReason === deleteList[deleteList.length - 1]
        ? etcReport
        : selectedReason;

    const data = await deleteUser({
      accessToken: cookies.accessToken,
      reason: reason,
    });
    if (!data?.success) {
      toast("내부 서버 오류 입니다." + data?.message);
      return;
    }
    setIsFinal(true);
    removeCookie("accessToken", { path: "/" });
  };

  return (
    <>
      {isFinal ? (
        <div className="flex min-h-screen w-full flex-col items-center justify-between">
          <div className="flex flex-grow flex-col items-center justify-center">
            <div className="mb-4 flex">
              <Image
                width={64}
                height={64}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/green_check_mark.svg`}
                alt={"회원 탈퇴 완료"}
              />
            </div>
            <div className="text-center text-lg font-bold text-slate-950">
              탈퇴가 완료되었습니다.
            </div>
            <div className="text-center text-base font-normal text-slate-700">
              주라벨을 이용해주셔서 감사드리며,
              <br />더 좋은 서비스로 찾아뵙겠습니다.
            </div>
          </div>

          <BottomButton
            enableButton={true}
            onClick={() => {
              router.push("/");
            }}
          >
            로그인 화면으로 가기
          </BottomButton>
        </div>
      ) : (
        <div className="h-full w-full max-w-[560px]">
          <UserHeader
            title="회원 탈퇴"
            handleBackButton={() => router.back()}
            bottomBorder={false}
          />
          <div className="mx-[4%]">
            <div className="mb-4 text-lg font-medium leading-[27px] text-slate-950">
              탈퇴 사유 선택
            </div>

            {deleteList.map((e: string) => (
              <>
                <div
                  key={e}
                  className="mb-2 flex items-center justify-start gap-1 py-1"
                >
                  <button
                    onClick={() => handleCheckboxChange(e)}
                    className="relative h-6 w-6 bg-white"
                  >
                    <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full border border-slate-500 bg-white" />
                    <div
                      className={cn(
                        "absolute left-[8px] top-[8px] h-2 w-2 rounded-full bg-slate-500",
                        selectedReason != e && "invisible",
                      )}
                    />
                  </button>
                  <div className="shrink grow basis-0 text-base font-normal text-slate-800">
                    {e}
                  </div>
                </div>
              </>
            ))}

            <textarea
              className="my-2 h-[136px] w-full resize-none rounded-[6px] border-[1px] border-cool-grayscale-300 p-2"
              value={etcReport}
              readOnly={selectedReason != "기타(직접 입력)"}
              placeholder="불편사항을 입력해주세요."
              maxLength={100}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleEtcReport(event)
              }
            />
            <div className="flex justify-end">
              <p
                className={`${etcReport.length === 0 ? "text-cool-grayscale-400" : "text-cool-grayscale-800"}, text-xs font-normal`}
              >
                {etcReport.length > 0 ? etcReport.length : 0}
              </p>
              <p className="text-xs font-normal text-cool-grayscale-800">
                /100
              </p>
            </div>
            <div className="my-8 h-[1px] bg-slate-100" />
            <div className="mb-4 text-lg font-medium text-black">
              탈퇴 전 확인해주세요.
            </div>
            <li className="mb-2 text-base font-normal text-slate-700">
              탈퇴 후에도 작성했던 게시글 및 댓글은 삭제되지 않습니다.
            </li>
            <li className="mb-2 text-base font-normal text-slate-700">
              탈퇴한 계정 및 데이터는 복구가 불가능합니다.
            </li>
            <li className="mb-2 text-base font-normal text-slate-700">
              탈퇴 후 같은 계정으로는 재가입이 불가능합니다.
            </li>
            <div className="mb-10 mt-4 flex">
              <Checkbox
                checked={isChecked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleFinalCheckBox(event)
                }
              />
              <div className="text-base font-normal text-slate-800">
                위 내용을 모두 확인하였습니다.
              </div>
            </div>
            <div className="inline-flex w-full items-center justify-start gap-4 py-4">
              <button
                onClick={() => router.back()}
                className="flex h-[37px] shrink grow items-center justify-center rounded bg-slate-100"
              >
                <div className="text-center text-sm font-bold leading-[21px] text-slate-500">
                  취소하기
                </div>
              </button>
              <button
                onClick={() => {
                  if (isChecked) setDeleteModalOpen(true);
                }}
                className={cn(
                  "flex h-[37px] shrink grow items-center justify-center rounded",
                  isChecked ? "bg-slate-950" : "bg-[#c4c4c4]",
                )}
              >
                <div className="text-center text-sm font-bold leading-[21px] text-white">
                  탈퇴하기
                </div>
              </button>
            </div>
          </div>
          {deleteModalOpen && (
            <ConfirmModal
              modalTitle="탈퇴 시 동일한 이메일로 재가입이 불가능해요."
              modalDescription="정말 탈퇴하시겠어요?"
              confirmText="탈퇴하기"
              cancelText="닫기"
              handleConfirm={() => {
                setDeleteModalOpen(false);
                handleDeleteBtn();
              }}
              handleCancel={() => setDeleteModalOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
