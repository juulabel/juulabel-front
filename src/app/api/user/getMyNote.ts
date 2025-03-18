import { instance } from "../axios";

export const getMyNote = async ({
  accessToken,
  lastNoteId,
}: {
  accessToken: string;
  lastNoteId: number | null;
}) => {
  const res = await instance.get(`/v1/api/members/tasting_notes/my`, {
    params: {
      lastTastingNoteId: lastNoteId,
      pageSize: 16,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data.result.myTastingNoteSummaries;
};
