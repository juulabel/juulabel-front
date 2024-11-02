import axios from "axios";
import { Cookies } from "react-cookie";

export default async function deleteNoteComments({
  tastingNoteId,
  commentId,
}: {
  tastingNoteId: number;
  commentId: number;
}) {
  const cookies = new Cookies();
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${tastingNoteId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
