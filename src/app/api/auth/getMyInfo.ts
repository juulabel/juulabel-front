import { instance } from "../axios";

export default async function getMyInfo() {
  try {
    const response = await instance.get(`/v1/api/members/my-info`, {
      withCredentials: true,
    });

    return response.data.result;
  } catch (error) {
    console.log(error);
  }
}
