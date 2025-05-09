"use client";

import ReportForm from "@/_components/report/ReportForm";
import { useReportStore } from "@/_store/useReportStore";
import postReport from "@/app/api/report/postReport";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface IReportChecked {
  [key: string]: boolean;
}

export default function Page() {
  const { reportId } = useReportStore();
  const router = useRouter();
  const reportList = {
    data: [
      "사기성 행위 또는 의심스러운 활동",
      "욕설, 비방, 또는 명예훼손",
      "허위 정보 또는 잘못된 정보",
      "성적이거나 불쾌한 내용",
      "불법적인 활동",
      "기타 (특정 상황이나 문제에 대한 신고)",
    ],
  };

  return (
    <>
      <ReportForm
        reportId={reportId}
        reportList={reportList}
        onSubmit={async (reportedContentId, reason, type) => {
          try {
            await postReport({
              reportedContentId: Number(reportedContentId),
              reason,
              type,
            });
          } catch (error) {
            toast(`신고 요청 중 오류 발생: ${error}`);
          }

          localStorage.setItem(
            "showToast",
            "해당 유저에 대한 신고가 완료되었습니다.",
          );
          router.push(`/user/profile/${reportId}`);
        }}
      />
    </>
  );
}
