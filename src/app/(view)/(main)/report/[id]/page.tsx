"use client";

import BottomButton from "@/_common/BottomButton";
import Checkbox from "@/_common/Checkbox";
import Loading from "@/_common/Loading";
import { getReportList } from "@/app/api/user/getReportList";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";

interface IReportChecked {
  [key: string]: boolean;
}

export default function Page({
  params: { id: reportId },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const reportList = {
    data: ["광고", "욕설", "폭언", "혐오", "불법적인 활동", "기타"],
  };
  const acceptableReportType = ["사용자", "일상생활", "시음노트", "댓글"];
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  // const {
  //   data: reportList,
  //   isLoading: isLoadingReportList,
  //   error,
  // } = useQuery({
  //   queryKey: ["reportList"],
  //   queryFn: getReportList,
  // });
  const [reportChecked, setReportChecked] = useState<IReportChecked>({});
  const [enableSubmitButton, setEnableSubmitButton] = useState<boolean>(false);
  const [etcReport, setEtcReport] = useState<string>("");

  useEffect(() => {
    if (reportList && reportList.data) {
      const initialCheckedState = reportList.data.reduce(
        (acc: IReportChecked, report: string) => {
          acc[report] = false;
          return acc;
        },
        {},
      );

      setReportChecked(initialCheckedState);
    }
  }, []);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    report: string,
  ) => {
    setReportChecked({
      ...reportChecked,
      [report]: event.target.checked,
    });
  };

  const handleEtcReport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEtcReport(event.target.value);
  };

  useEffect(() => {
    const anyChecked = Object.values(reportChecked).some(
      (value) => value === true,
    );
    setEnableSubmitButton(anyChecked);
  }, [reportChecked]);

  const handleSubmitButton = () => {
    alert("정상적으로 신고되었습니다!");
  };
  if (!acceptableReportType.includes(type ?? "")) {
    router.push("/404");
  }
  // if (isLoadingReportList) return <Loading />;
  // if (error) return <div>Error : {error.message}</div>;
  return (
    <div className="h-full w-full max-w-[560px]">
      <div className="mx-[4%] flex h-16 flex-row items-center justify-between">
        <button onClick={() => router.back()} className="left-4 p-1">
          <GoChevronLeft size={24} />
        </button>

        <div className="text-lg font-bold">{type} 신고하기</div>
        <button>
          <Image
            width={32}
            height={32}
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_PATH}/svg/close_icon.svg`}
            alt="닫기 아이콘"
            onClick={() => router.back()}
          />
        </button>
      </div>
      <div className="h-[1px] w-full bg-cool-grayscale-300" />
      <div className="mx-[4%] pt-4">
        <p className="text-xl font-bold text-cool-grayscale-800">
          신고 사유를 선택해주세요.
        </p>
        <p className="pt-[4px] text-sm font-normal text-cool-grayscale-500">
          복수선택 가능
        </p>

        <div className="flex flex-col pt-[24px]">
          {reportList.data.map((report: string) => (
            <>
              <div key={report} className="my-2 flex max-h-[56px] flex-row">
                <Checkbox
                  checked={reportChecked[report]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxChange(event, report)
                  }
                />
                <p className="mx-[1%] text-base font-normal">{report}</p>
              </div>
            </>
          ))}
        </div>
        <textarea
          className="my-2 h-20 w-full resize-none rounded-[6px] border-[1px] border-cool-grayscale-300 p-2"
          value={etcReport}
          placeholder="기타사유를 입력해주세요."
          maxLength={500}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleEtcReport(event)
          }
        />
        <div className="flex justify-end">
          <p
            className={`${etcReport.length === 0 ? "text-cool-grayscale-400" : "text-cool-grayscale-800"}`}
          >
            {etcReport.length > 0 ? etcReport.length : 0}
          </p>
          <p className="text-cool-grayscale-800">/500</p>
        </div>
        <BottomButton
          enableButton={enableSubmitButton}
          onClick={handleSubmitButton}
        >
          주라벨팀에게 보내기
        </BottomButton>
      </div>
    </div>
  );
}
