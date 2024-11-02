import axios from "axios";
import { Cookies } from "react-cookie";

export default async function getNoteDetail({
  token,
  id,
}: {
  token?: string;
  id: number;
}) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
