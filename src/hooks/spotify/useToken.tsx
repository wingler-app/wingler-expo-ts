import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';
import type {
  AuthRequest,
  AuthRequestPromptOptions,
  AuthSessionResult,
} from 'expo-auth-session';
import { ResponseType, TokenResponse, useAuthRequest } from 'expo-auth-session';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import type { SpotifyGrantType } from '@/types/spotify';
import {
  clientId,
  clientSecret,
  discovery,
  redirectUri,
  scopes,
} from '@/utils/spotify';

const useToken = (): [
  TokenResponse | null,
  AuthRequest | null,
  (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
  AuthSessionResult | null,
  (grantType: SpotifyGrantType, codeOrRefreshToken: string) => void,
] => {
  WebBrowser.maybeCompleteAuthSession();
  const [params, setParams] = useState<any | null>(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId,
      clientSecret,
      scopes,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri,
    },
    discovery,
  );

  const handleToken = useCallback(
    async (grantType: SpotifyGrantType, codeOrRefreshToken: string) => {
      const body = new URLSearchParams({
        grant_type: grantType,
        [grantType === 'authorization_code' ? 'code' : 'refresh_token']:
          codeOrRefreshToken,
        ...(grantType === 'authorization_code'
          ? { redirect_uri: redirectUri }
          : {}),
      }).toString();

      try {
        const credsB64 = btoa(`${clientId}:${clientSecret}`);
        const res = await fetch(discovery.tokenEndpoint, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credsB64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        const myTokenResponse = TokenResponse.fromQueryParams(await res.json());
        if (grantType === 'refresh_token')
          myTokenResponse.refreshToken = codeOrRefreshToken;

        setParams(myTokenResponse);
        AsyncStorage.setItem('@SpotifyParams', JSON.stringify(myTokenResponse));
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@SpotifyParams');

      if (data) {
        const myTokenResponse: TokenResponse = JSON.parse(data);

        if (TokenResponse.isTokenFresh(myTokenResponse)) {
          setParams(myTokenResponse);
        } else if (myTokenResponse.refreshToken) {
          handleToken('refresh_token', myTokenResponse.refreshToken);
        }
      } else {
        router.push('/settings');
      }
    })();
  }, [handleToken]);

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.params.code)
        handleToken('authorization_code', response.params.code);
    }
  }, [response, handleToken]);

  return [params, request, promptAsync, response, handleToken];
};

export default useToken;
