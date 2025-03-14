import axios from "axios";
import { Cookies } from "react-cookie";

export default async function getTraditionalLiquor({
  alcoholicDrinksId,
}: {
  alcoholicDrinksId: number;
}) {
  const cookies = new Cookies();

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/alcoholicDrinks/${alcoholicDrinksId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get("accessToken")}`,
      },
    },
  );

  return response.data;
}
