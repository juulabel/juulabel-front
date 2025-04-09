import axios from "axios";
import { Cookies } from "react-cookie";

export const getFollowee = async (
  id: string,
  lastFolloweeId: string | null,
) => {
  try {
    const cookies = new Cookies();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/${id}/followings`,
      {
        withCredentials: true,
        params: {
          lastFolloweeId: lastFolloweeId,
          pageSize: 15,
        },
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
