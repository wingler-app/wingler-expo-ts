export interface SpotifyResponse {
  loading: boolean;
  error: FetchError | null;
}

export type FetchError = {
  status: number;
  message: string;
};

export type Track = {
  uri: string;
  name: string;
  albumCover: string;
  artist: {
    name: string;
    id: string;
  };
  colors: string[];
};

export type DeviceType = {
  id: number;
  name: string;
};

export type ArtistProps = string;

export interface ArtistType {
  uri: string;
  avatar: string;
}

export interface ArtistResponse extends SpotifyResponse {
  answer: ArtistType;
}

export type SpotifyGrantType = 'authorization_code' | 'refresh_token';
