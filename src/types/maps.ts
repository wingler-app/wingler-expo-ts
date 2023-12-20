export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export interface PlaceDetails {
  address_components: AddressComponent[];
  adr_address: string;
  business_status: string;
  current_opening_hours: object;
  editorial_summary: object;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: object;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  international_phone_number: string;
  name: string;
  opening_hours: object;
  photos: Photo[];
  place_id: string;
  plus_code: object;
  rating: number;
  reference: string;
  reviews: Review[];
  types: string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  wheelchair_accessible_entrance: boolean;
}
