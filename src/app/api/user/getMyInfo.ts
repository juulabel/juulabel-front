import axios from "axios";

export default async function getMyInfo(accessToken: string) {
  try {
    const response = await axios.get(
      `https://juulabel.shop/v1/api/members/my-info`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data.result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
