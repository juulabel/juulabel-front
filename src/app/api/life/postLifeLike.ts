import axios from "axios";

export default async function postLifeLike({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${id}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
