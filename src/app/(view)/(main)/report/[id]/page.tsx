"use client";

import Loading from "@/_common/Loading";
import ReportForm from "@/_components/report/ReportForm";
import { useRouter } from "next/navigation";

export default function Page({
  params: { id: reportId },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const reportList = {
    data: [
      "광고 / 스팸",
      "욕설 / 비방 / 명예훼손",
      "허위 정보 / 잘못된 정보",
      "성적, 불쾌한 내용",
      "불법적인 활동",
      "기타",
    ],
  };

  // const acceptableReportType = ["사용자", "일상생활", "시음노트", "댓글"];

  // if (isLoadingReportList) return <Loading />;
  // if (error) return <div>Error : {error.message}</div>;
  return (
    <ReportForm
      reportList={reportList}
      onSubmit={(reportString) => {
        console.log("게시글 신고 내용:", reportString);
        alert("정상적으로 신고되었습니다!");
      }}
    />
  );
}
