import { HelpScoutRequester } from './requester';

export type HelpScoutAccessTokenReponse = {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
};

export const getAccessToken = (requester: HelpScoutRequester) => {
  return () => {
    return requester.request<HelpScoutAccessTokenReponse>({
      endpoint: '/oauth2/token',
      method: 'POST',
      body: {
        grant_type: 'client_credentials',
        client_id: requester.appId,
        client_secret: requester.appSecret,
      },
    });
  };
};
