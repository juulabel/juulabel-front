"use client";

import ReportForm from "@/_components/report/ReportForm";

interface IReportChecked {
  [key: string]: boolean;
}

export default function Page() {
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
    <ReportForm
      reportList={reportList}
      onSubmit={(reportString) => {
        console.log("유저 신고 내용:", reportString);
        alert("정상적으로 신고되었습니다!");
      }}
    />
  );
}
