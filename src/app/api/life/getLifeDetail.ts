import axios from "axios";
import { instance } from "../axios";
import { Cookies } from "react-cookie";

export async function getLifeDetail({ id }: { id: number }) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/daily-lives/${id}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
