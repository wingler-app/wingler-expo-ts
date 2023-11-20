import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';
import { makeRedirectUri } from 'expo-auth-session';

export const API: string = 'https://api.spotify.com/v1/';

export const MethodMap = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const clientId = SPOTIFY_CLIENT_ID;
export const clientSecret = SPOTIFY_CLIENT_SECRET;

// Endpoint
export const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export const scopes: string[] = [
  'user-read-email',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'streaming',
];

export const spotifyFetch = async (
  url: string,
  token: string,
  method?: keyof typeof MethodMap,
  body: any = null,
): Promise<any> => {
  try {
    const response = await fetch(`${API}${url}`, {
      method: method || MethodMap.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return null;
  }
};

export const redirectUri = makeRedirectUri({
  native: 'com.wingler:/settings',
});
