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
