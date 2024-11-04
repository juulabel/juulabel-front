import { instance } from "../axios";

export async function getColors(alcoholTypeId: number) {
  try {
    const response = await instance.get(
      `/v1/api/shared-space/tasting-notes/${alcoholTypeId}/colors`,
    );
    if (response.status === 200 && response.data) {
      return response.data.result.colors;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getScents(alcoholTypeId: number) {
  try {
    const response = await instance.get(
      `/v1/api/shared-space/tasting-notes/${alcoholTypeId}/scent`,
    );
    if (response.status === 200 && response.data) {
      return response.data.result.categories;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
    
  }
}

export async function getSensories(alcoholTypeId: number) {
  try {
    const response = await instance.get(
      `/v1/api/shared-space/tasting-notes/${alcoholTypeId}/sensory`,
    );
    if (response.status === 200 && response.data) {
      return response.data.result.sensoryLevelInfos;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getFlavors(alcoholTypeId: number) {
  try {
    const response = await instance.get(
      `/v1/api/shared-space/tasting-notes/${alcoholTypeId}/flavor`,
    );
    if (response.status === 200 && response.data) {
      return response.data.result.flavorLevels;
    } else {
      throw new Error(
        `Unexpected response : ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}
