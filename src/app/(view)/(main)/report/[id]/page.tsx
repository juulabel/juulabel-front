"use client";

import Loading from "@/_common/Loading";
import ReportForm from "@/_components/report/ReportForm";
import postReport from "@/app/api/report/postReport";
import { useRouter } from "next/navigation";

export default async function Page({
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

  return (
    <ReportForm
      reportList={reportList}
      reportId={reportId}
      onSubmit={async (reportedContentId, reason, type) => {
        try {
          await postReport({
            reportedContentId: Number(reportedContentId),
            reason,
            type,
          });
        } catch (error) {
          console.error("신고 요청 중 오류 발생:", error);
        }

        alert("정상적으로 신고되었습니다!");
      }}
    />
  );
}
