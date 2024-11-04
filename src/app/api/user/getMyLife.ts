import { instance } from "../axios";

export const getMyLife = async ({
  accessToken,
  lastLifeId,
}: {
  accessToken: string;
  lastLifeId: number | null;
}) => {
  const res = await instance.get(`/v1/api/members/daily-lives/my`, {
    params: {
      lastTastingNoteId: lastLifeId,
      pageSize: 10,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data.result.myDailyLifeSummaries;
};
