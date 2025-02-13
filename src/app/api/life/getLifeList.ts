import axios from "axios";
import { Cookies } from "react-cookie";

export const getLifeList = async ({
  lastDailyLifeId,
}: {
  lastDailyLifeId: string | null;
}) => {
  const cookies = new Cookies();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives`,
    {
      params: {
        lastDailyLifeId: lastDailyLifeId,
        pageSize: 10,
      },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );
  const { content, last } = res.data.result.dailyLifeSummaries;

  return {
    content,
    nextPage: last
      ? null
      : {
          lastDailyLifeId: content[content.length - 1]?.dailyLifeId || null,
        },
  };
};
