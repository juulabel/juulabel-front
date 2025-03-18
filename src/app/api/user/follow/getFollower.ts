import axios from "axios";
import { Cookies } from "react-cookie";

export const getFollower = async (id: string, lastFollowId: string | null) => {
  try {
    const cookies = new Cookies();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/members/${id}/followers`,
      {
        withCredentials: true,
        params: {
          lastFollowId: lastFollowId,
          pageSize: 15,
        },
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      },
    );

    const { content, last } = res.data.result.followers;    
    return {
      content,
      nextPage: last
        ? null
        : {
            lastFollowId: content[content.length - 1]?.id || null,
          },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
