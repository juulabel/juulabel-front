import axios from "axios";
import { Cookies } from "react-cookie";

export default async function getDailyLifeReply({
  dailyLifeId,
  dailyLifeCommentId,
  lastReplyId,
}: {
  dailyLifeId: number;
  dailyLifeCommentId: number;
  lastReplyId: number | null;
}) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${dailyLifeId}/comments/${dailyLifeCommentId}`,
    {
      params: {
        lastReplyId: lastReplyId,
        pageSize: 10,
      },
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return {
    data: response.data.result.dailyLifeReplySummaries.content,
    last: response.data.result.dailyLifeReplySummaries.last,
  };
}
