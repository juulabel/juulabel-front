"use client";

import BottomButton from "@/_common/BottomButton";
import Checkbox from "@/_common/Checkbox";
import UserHeader from "@/_components/user/UserHeader";
import { cn } from "@/_utils/commons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["accessToken"]);

  const [etcReport, setEtcReport] = useState<string>("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const router = useRouter();

  const handleEtcReport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEtcReport(event.target.value);
  };

  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      {isFinal ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <Image
              width={64}
              height={64}
              src={"/svg/green_check_mark.svg"}
              alt={""}
            />
          </div>
          <div className="text-center text-lg font-bold text-slate-950">
            탈퇴가 완료되었습니다.
          </div>
          <div className="text-center text-base font-normal text-slate-700">
            주라벨을 이용해주셔서 감사드리며,
            <br />더 좋은 서비스로 찾아뵙겠습니다.
          </div>
          <BottomButton
            enableButton={true}
            onClick={() => {
              router.push("/share/note");
            }}
            children={"로그인 화면으로 가기"}
          />
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

            <div className="mb-2 flex items-center justify-start gap-1 py-1">
              <div className="relative h-6 w-6 bg-white">
                <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full border border-slate-500 bg-white" />
                <div className="absolute left-[8px] top-[8px] h-2 w-2 rounded-full bg-slate-500" />
              </div>
              <div className="shrink grow basis-0 text-base font-normal text-slate-800">
                제공되는 기능이 기대에 미치지 않음
              </div>
            </div>
            <div className="mb-2 flex items-center justify-start gap-1 py-1">
              <div className="relative h-6 w-6 bg-white">
                <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full border border-slate-300 bg-white" />
              </div>
              <div className="shrink grow basis-0 text-base font-normal text-slate-800">
                제공되는 기능이 기대에 미치지 않음
              </div>
            </div>
            <div className="mb-2 flex items-center justify-start gap-1 py-1">
              <div className="relative h-6 w-6 bg-white">
                <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full border border-slate-300 bg-white" />
              </div>
              <div className="shrink grow basis-0 text-base font-normal text-slate-800">
                제공되는 기능이 기대에 미치지 않음
              </div>
            </div>
            <div className="mb-2 flex items-center justify-start gap-1 py-1">
              <div className="relative h-6 w-6 bg-white">
                <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full border border-slate-300 bg-white" />
              </div>
              <div className="shrink grow basis-0 text-base font-normal text-slate-800">
                제공되는 기능이 기대에 미치지 않음
              </div>
            </div>

            <textarea
              className="my-2 h-[136px] w-full resize-none rounded-[6px] border-[1px] border-cool-grayscale-300 p-2"
              value={etcReport}
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
                  handleCheckBox(event)
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
        </div>
      )}
    </>
  );
}
