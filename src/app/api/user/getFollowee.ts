import axios from "axios";
import { Cookies } from "react-cookie";

export const getFollowee = async (id: string, lastFolloweeId: number) => {
  try {
    const cookies = new Cookies();
    const queryParams = new URLSearchParams();
    queryParams.set("pageSize", "15");
    queryParams.set("lastFolloweeId", lastFolloweeId.toString());
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/${id}/followings?${queryParams.toString()}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      },
    );
    const { content, last } = res.data.result.followings;
    return {
      content,
      nextPage: last
        ? null
        : {
            lastFolloweeId: content[content.length - 1]?.id || null,
          },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
