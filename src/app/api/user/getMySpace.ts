import axios from "axios";

export async function getMySpace(accessToken: string) {
  try {
    const response = await axios.get(
      `https://juulabel.shop/v1/api/members/my-space`,
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
  } catch (error) {
    console.error(error);
    return null;
  }
}
