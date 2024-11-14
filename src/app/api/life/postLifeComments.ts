import axios from "axios";
import { Cookies } from "react-cookie";

export default async function postDailyLifeComments({
  id,
  content,
  parentCommentId,
}: {
  id: number;
  content: string;
  parentCommentId?: number;
}) {
  const cookies = new Cookies();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${id}/comments`,
    {
      content: content,
      parentCommentId: parentCommentId,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
