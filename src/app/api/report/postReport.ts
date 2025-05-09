import { instance } from "@/app/api/axios";

interface ReportPayload {
  reportedContentId: number;
  reason: string;
  type: string;
}

export default async function postReport(payload: ReportPayload) {
  try {
    const response = await instance.post("/v1/api/reports", payload);

    return response.data;
  } catch (error: any) {
    console.error("신고 API 요청 중 오류 발생");
    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);
    } else {
      console.error("요청 자체 실패:", error.message);
    }
    throw error;
  }
}
