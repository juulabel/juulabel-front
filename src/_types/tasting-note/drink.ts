export interface AlcoholType {
  id: number;
  name: string;
}

export interface Brewery {
  id: number;
  name: string;
  region: string;
  message: string;
}

export interface AlcoholicDrink {
  id: number;
  name: string;
  thumbnail: string;
  alcoholContent: number;
  alcoholType: AlcoholType;
  brewery: Brewery;
}

export interface DrinkApiResponse {
  success: boolean;
  message: string;
  result: {
    alcoholicDrinks: AlcoholicDrink[];
  };
}
