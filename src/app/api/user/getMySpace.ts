import axios from "axios";

export async function getMySpace(accessToken: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/my-space`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 200 && response.data) return response.data.result;
  else
    throw new Error(
      `Unexpected response : ${response.status} ${response.statusText}`,
    );
}
