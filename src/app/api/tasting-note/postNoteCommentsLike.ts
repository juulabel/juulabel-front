import axios from "axios";
import { Cookies } from "react-cookie";

export default async function postNoteCommentsLike({
  tastingNoteId,
  commentId,
}: {
  tastingNoteId: number;
  commentId: number;
}) {
  const cookies = new Cookies();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${tastingNoteId}/comments/${commentId}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
