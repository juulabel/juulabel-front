import { instance } from "../axios";

export default async function getNoteList({
  lastTastingNoteId,
}: {
  lastTastingNoteId?: number | null;
}) {
  const response = await instance.get(`/v1/api/shared-space/tasting-notes`, {
    params: {
      lastTastingNoteId: lastTastingNoteId,
      pageSize: 10,
    },
  });

  return {
    data: response.data.result.tastingNoteSummaries.content,
    last: response.data.result.tastingNoteSummaries.last,
  };
}
