import axios from "axios";

export async function getTastingNoteBasicInformation(id: number) {
  try {
    const response = await axios.get(
      `https://api.example.com/v1/api/tasting-note/basic?id=${id}`,
    );
    if (response.status === 200 && response.data)
      return response.data.information;
    else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
