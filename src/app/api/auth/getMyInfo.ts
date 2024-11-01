import axios from "axios";
import { useCookies } from "react-cookie";

export default async function getMyInfo({ token }: { token: string }) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/my-info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
