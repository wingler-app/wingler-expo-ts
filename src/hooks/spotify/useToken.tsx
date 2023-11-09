import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import type {
  AuthRequest,
  AuthRequestPromptOptions,
  AuthSessionResult,
} from 'expo-auth-session';
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import type { SpotifyAuthResponse, SpotifyParamsRecord } from '@/types/spotify';
import { clientId, discovery, scopes } from '@/utils/spotify';

const useToken = (): [
  SpotifyAuthResponse | null,
  AuthRequest | null,
  (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
  AuthSessionResult | null,
  (token: string) => void,
] => {
  WebBrowser.maybeCompleteAuthSession();
  const [params, setParams] = useState<any | null>(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId,
      scopes,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: 'com.wingler:/settings',
      }),
    },
    discovery,
  );
  const { getItem: getSpotifyParams, setItem: setSpotifyParams } =
    useAsyncStorage('@SpotifyParams');

  const handleResponse = useCallback(
    async (res: any) => {
      if (res.type !== 'success') return;
      try {
        const newParams = {
          ...res.params,
          timestamp: Date.now(),
        };
        setParams(newParams);
        await setSpotifyParams(newParams);
        console.log('Got new params');
      } catch (e) {
        console.log(e);
      }
    },
    [setSpotifyParams],
  );

  const refreshToken = useCallback(
    async (token: string) => {
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${token}&client_id=${clientId}`,
      };
      const body = await fetch(discovery.tokenEndpoint, payload);
      const res = await body.json();
      console.log('refreshed token', res);
      handleResponse(res);
    },
    [handleResponse],
  );
  useEffect(() => {
    (async () => {
      const paramsString = await getSpotifyParams();
      if (paramsString) {
        console.log('Got params from storage', paramsString);
        const paramsData: SpotifyParamsRecord = JSON.parse(paramsString);
        const expirationTime =
          paramsData.expires_in * 1000 + paramsData.timestamp;
        if (expirationTime > Date.now()) {
          setParams(paramsData);
        } else {
          // promptAsync();
          console.log('paramsData: ', paramsData);
          refreshToken(paramsData.access_token);
        }
      } else {
        promptAsync();
      }
    })();
  }, [getSpotifyParams, promptAsync, refreshToken]);

  useEffect(() => {
    handleResponse(response);
  }, [handleResponse, response]);

  return [params, request, promptAsync, response, refreshToken];
};

export default useToken;
