import { alcoholType } from "@/_config/alcoholType";

export const getAlocholTypeIds = (selectedAlcoholTypes: number[]) => {
  const typeMap = alcoholType.reduce(
    (acc, type) => {
      acc[type.value] = type.key;
      return acc;
    },
    {} as Record<string, number>,
  );
  return selectedAlcoholTypes.map((type) => typeMap[type]);
};
