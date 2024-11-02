import axios from "axios";
import { Cookies } from "react-cookie";

export default async function patchNoteComments({
  tastingNoteId,
  commentId,
  content,
}: {
  tastingNoteId: number;
  commentId: number;
  content: string;
}) {
  const cookies = new Cookies();
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${tastingNoteId}/comments/${commentId}`,
    {
      content: content,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
