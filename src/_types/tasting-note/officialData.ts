export interface IOfficialData {
  id: number;
  name: string;
  alcoholContent: number;
  alcoholType: {
    id: number;
    name: string;
  };
  brewery: {
    id: number;
    name: string;
    region: string;
  };
  thumbnail?: string;
}

export interface IAlcoholType {
  id: number;
  name: string;
}

export interface IBrewery {
  id: number;
  name: string;
  region: string;
  message: string;
}

export interface IAlcoholicDrinksDetailInfo {
  id: number;
  name: string;
  thumbnail: string;
  alcoholContent: number;
  alcoholicVolume: number;
  discountPrice: number;
  regularPrice: number;
  rating: number;
  tastingNoteCount: number;
  alcoholType: IAlcoholType;
  brewery: IBrewery;
}

export interface IFlavor {
  name: string;
  score: number;
}

export interface ISensory {
  name: string;
  score: number;
  id: number;
}

export interface ITastingNoteSensorSummary {
  tastingNoteId: number;
  rgb: string;
  scent: string[];
  flavor: IFlavor[];
  sensory: ISensory[];
}

export interface IResponseTranditionalLiquor {
  alcoholicDrinksDetailInfo: IAlcoholicDrinksDetailInfo;
  ingredientSummary: any[]; //무슨값인지 모르겠음
  tastingNoteSensorSummary: ITastingNoteSensorSummary;
  tastingNoteSummary: any[]; //무슨값인지 모르겠음
}
