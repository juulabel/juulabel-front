"use client";

import ReportForm from "@/_components/report/ReportForm";
import useCommentsModalStore from "@/_store/tastingCommentModal";
import postReport from "@/app/api/report/postReport";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function Page({
  params: { id: reportId },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");

  const { closeModal } = useCommentsModalStore();
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
          toast(`신고 요청 중 오류 발생: ${error}`);
        }

        let message;
        switch (type) {
          case "DAILY_LIFE_COMMENT":
          case "TASTING_NOTE_COMMENT":
            message = "해당 댓글에 대한 신고가 완료되었습니다.";
            break;
          case "TASTING_NOTE":
          case "DAILY_LIFE":
            message = "해당 게시물에 대한 신고가 완료되었습니다.";
            break;
          default:
            message = "신고가 완료되었습니다.";
        }
        localStorage.setItem("showToast", message);
        let redirectUrl;
        switch (type) {
          case "DAILY_LIFE_COMMENT":
            redirectUrl = `/share/life/${postId}`;
            break;
          case "DAILY_LIFE":
            redirectUrl = `/share/life/${reportId}`;
            break;
          case "TASTING_NOTE_COMMENT":
            redirectUrl = `/share/note/${postId}`;
            break;
          case "TASTING_NOTE":
            redirectUrl = `/share/note/${reportId}`;
            break;
          default:
            redirectUrl = "/";
        }
        closeModal();
        router.push(`${redirectUrl}`);
      }}
    />
  );
}
