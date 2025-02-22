import axios from "axios";
import { Cookies } from "react-cookie";

export async function getSearchUser(params: {
  lastFollowId: number | null | undefined;
  pageSize: number;
  username: string;
}) {
  const cookies = new Cookies();
  try {
    const headers = {
      Authorization: `Bearer ${cookies.get("accessToken")}`,
    };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/search`,
      {
        params,
        withCredentials: true,
        headers,
      },
    );
    if (response.status === 200 && response.data) return response.data;
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
