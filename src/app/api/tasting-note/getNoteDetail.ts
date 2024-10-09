import axios from "axios";

export default async function getNoteDetail({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/shared-space/tasting-notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
