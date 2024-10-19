import { IAlcoholSearchData } from "./alcoholSearchData";

export interface IAlcoholSearchResult {
  isLast: boolean;
  alcoholicDrinks: IAlcoholSearchData[];
}
