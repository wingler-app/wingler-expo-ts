import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';
import type {
  AuthRequest,
  AuthRequestPromptOptions,
  AuthSessionResult,
} from 'expo-auth-session';
import { ResponseType, TokenResponse, useAuthRequest } from 'expo-auth-session';
// import { getCurrentTimeInSeconds } from 'expo-auth-session/build/TokenRequest';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import type {
  SpotifyAuthResponse,
  SpotifyGrantType,
  SpotifyParamsRecord,
} from '@/types/spotify';
import {
  clientId,
  clientSecret,
  discovery,
  redirectUri,
  scopes,
} from '@/utils/spotify';

export function getCurrentTimeInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

const useToken = (): [
  SpotifyAuthResponse | null,
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

        const responseJson = await res.json();
        const newParams = {
          ...responseJson,
          timestamp: Date.now(),
          // issuedAt: getCurrentTimeInSeconds() - 6000000,
          issuedAt: 1700227249097,
        };
        if (grantType === 'refresh_token')
          newParams.refresh_token = codeOrRefreshToken;
        console.log('newParams', newParams);
        setParams(newParams);
        AsyncStorage.setItem('@SpotifyParams', JSON.stringify(newParams));
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const paramsString = await AsyncStorage.getItem('@SpotifyParams');

      if (paramsString) {
        console.log('Got params from storage', paramsString);
        const paramsData: SpotifyParamsRecord = JSON.parse(paramsString);
        const myTokenResponse = TokenResponse.fromQueryParams(paramsData);
        // console.log('myTokenResponse', myTokenResponse);
        console.log('time', getCurrentTimeInSeconds());
        console.log('myTokenResponse', myTokenResponse.issuedAt);
        console.log(
          'isTokenFresh',
          TokenResponse.isTokenFresh(myTokenResponse),
        );
        console.log('refresh? ', myTokenResponse.shouldRefresh());

        const expirationTime =
          paramsData.expires_in * 1000 + paramsData.timestamp;
        if (expirationTime > Date.now()) {
          setParams(paramsData);
        } else {
          handleToken('refresh_token', paramsData.refresh_token);
        }
      } else {
        router.push('/settings');
      }
    })();
  }, [handleToken]);

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.params.code)
        handleToken('authorization_code', response.params?.code);
    }
  }, [response, handleToken]);

  return [params, request, promptAsync, response, handleToken];
};

export default useToken;
