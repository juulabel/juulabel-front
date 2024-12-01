import axios from "axios";
import { Cookies } from "react-cookie";

export default async function postLifeCommentsLike({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}) {
  const cookies = new Cookies();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${postId}/comments/${commentId}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
