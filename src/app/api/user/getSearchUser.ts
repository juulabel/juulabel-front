import axios from "axios";

export async function getSearchUser() {
  try {
    const response = await axios.get("/v1/api/user/search");
    if (response.status === 200 && response.data) return response.data;
    else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
