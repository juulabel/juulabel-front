import axios from "axios";

export default async function getLifeComments({
  token,
  id,
  lastCommentId,
}: {
  token: string;
  id: number;
  lastCommentId: number | null;
}) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${id}/comments`,
    {
      params: {
        lastCommentId: lastCommentId,
        pageSize: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    data: response.data.result.dailyLifeCommentSummaries.content,
    last: response.data.result.dailyLifeCommentSummaries.last,
  };
}
