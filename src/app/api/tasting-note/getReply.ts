import axios from "axios";
import { Cookies } from "react-cookie";

export default async function getReply({
  tastingNoteId,
  tastingNoteCommentId,
  lastReplyId,
}: {
  tastingNoteId: number;
  tastingNoteCommentId: number;
  lastReplyId: number | null;
}) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${tastingNoteId}/comments/${tastingNoteCommentId}`,
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
    data: response.data.result.tastingNoteReplySummaries.content,
    last: response.data.result.tastingNoteReplySummaries.last,
  };
}
