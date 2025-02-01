import { INoteThumbnail } from "@/_types/share";
import axios from "axios";
import { Cookies } from "react-cookie";

export default async function getNoteList({
  lastTastingNoteId,
}: {
  lastTastingNoteId?: number | null;
}) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes`,
    {
      params: {
        lastTastingNoteId: lastTastingNoteId,
        pageSize: 10,
      },
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return {
    data: response.data.result.tastingNoteSummaries.content,
    last: response.data.result.tastingNoteSummaries.last,
  };
}
