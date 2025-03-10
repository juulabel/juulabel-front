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
        // Authorization: `Bearer ${cookies.get("accessToken")}`,
        Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJqdzY2NjRAbmF0ZS5jb20iLCJpYXQiOjE3NDE0MzE0NjcsImV4cCI6MTc0MTQ1MzA2N30.xl1TTf1BArp5zLEp6y63R8ZzDjtItdOPM_Q9DT4xLXowwsuVfJp_o6JVSVr3GWlo`,
      },
    },
  );

  return response.data;
}
