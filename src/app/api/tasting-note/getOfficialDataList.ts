import axios from "axios";

export async function getOfficialDataList() {
  try {
    const response = await axios.get(
      "https://api.example.com/v1/api/tasting-note/official-data",
    );
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
