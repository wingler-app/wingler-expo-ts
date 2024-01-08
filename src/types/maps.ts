export interface PlaceDetails {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  adr_address: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  id: string;
  name: string;
  photos: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
  website: string;
  opening_hours?: {
    open_now: boolean;
    periods: {
      close: {
        day: number;
        time: string;
      };
      open: {
        day: number;
        time: string;
      };
    }[];
    weekday_text: string[];
  };
  reviews?: {
    author_name: string;
    author_url: string;
    language: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
  }[];
  user_ratings_total?: number;
  price_level?: number;
  rating?: number;
  international_phone_number?: string;
  formatted_phone_number?: string;
}
