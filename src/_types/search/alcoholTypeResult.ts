import { IAlcoholTypeData } from "./alcoholTypeData";

export interface IAlcoholTypeResult {
  isLast: boolean;
  totalCount: number;
  alcoholicDrinks: { content: IAlcoholTypeData[] };
}
