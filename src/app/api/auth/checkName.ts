import { instance } from "../axios";

export const checkNickname = async (nickname: string) => {
  try {
    const response = await instance.get(
      `/v1/api/members/nicknames/${nickname}/exists`,
    );
    if (response.data) {
        console.log(response);
        
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
