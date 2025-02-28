import axios from "axios";

export async function getRelatedSearchData(
  searchData: string,
): Promise<string[] | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_JUULABEL_API_URL}/v1/api/alcoholicDrinks/related-search?keyword=` +
        searchData,
    ); //추후 API 수정 시에 queryString에 searchData 추가
    if (response.status === 200 && response.data)
      return response.data.result.relationSearch;
    else
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
  } catch (error) {
    console.error(error);
    return null;
  }
}
