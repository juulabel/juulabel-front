import { reportListDummyData } from "./../../../mocks/data";
import axios from "axios";

export async function getReportList() {
  try {
    const response = await axios.get("/v1/api/user/report/list");
    if (response.status === 200 && response.data) return response.data;
    throw new Error(
      `Unexpected response : ${response.status} ${response.statusText}`,
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}
