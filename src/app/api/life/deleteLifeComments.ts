import axios from "axios";
import { Cookies } from "react-cookie";

export default async function deleteDailyLifeComments({
  dailyLifeId,
  commentId,
}: {
  dailyLifeId: number;
  commentId: number;
}) {
  const cookies = new Cookies();
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${dailyLifeId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
