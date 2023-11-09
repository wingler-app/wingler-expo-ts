export const API: string = 'https://api.spotify.com/v1/';

export const MethodMap = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const clientId = '6960973e424a4929845ac3b16e377c68';

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
