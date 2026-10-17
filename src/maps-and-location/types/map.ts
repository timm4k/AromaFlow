export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlacePin {
  id: string;
  title: string;
  coordinate: Coordinates;
  createdAt: string;
  icon: string;
  saved: boolean;
}

export interface ScentOrigin {
  scentId: string;
  species: string;
  region: string;
  rangeNote: string;
  coordinate: Coordinates;
  sourceName: string;
  sourceUrl: string;
}
