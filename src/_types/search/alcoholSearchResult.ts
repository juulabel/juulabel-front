import { IAlcoholSearchData } from "./alcoholSearchData";

export interface IAlcoholSearchResult {
  isLast: boolean;
  totalCount: number;
  alcoholicDrinks: IAlcoholSearchData[];
}
