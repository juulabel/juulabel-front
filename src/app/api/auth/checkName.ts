import { instance } from "../axios";

export const checkNickname = async (nickname: string) => {
  try {
    const response = await instance.get(
      `/v1/api/members/nicknames/${nickname}/exists`,
    );
    if (response.data) {
      return response.data.result;
    }
  } catch (error) {
    console.error(error);
  }
};
