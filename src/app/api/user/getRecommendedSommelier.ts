import axios from "axios";

export async function getRecommendedSommelier() {
  try {
    const response = await axios.get(`/v1/api/user/recommend/sommelier`);
    if (response.status === 200 && response.data) return response.data.data;
    else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
