import axios from 'axios';

type HScoutClientOptions = {
  appId: string;
  appSecret: string;
};

type HScoutRequestOptions = {
  endpoint: string;
  method: 'POST';
  body: any;
  headers?: {
    [key: string]: string;
  };
};

type HScoutTokenReponse = {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
};

export const createHelpScoutClient = (options: HScoutClientOptions) => {
  const request = ({ endpoint, body, headers = {} }: HScoutRequestOptions) =>
    axios
      .post(`https://api.helpscout.net/v2${endpoint}`, body, {
        headers,
      })
      .then(response => {
        return response.data;
      });

  return {
    getAccessToken(): Promise<HScoutTokenReponse> {
      return request({
        endpoint: '/oauth2/token',
        method: 'POST',
        body: {
          grant_type: 'client_credentials',
          client_id: options.appId,
          client_secret: options.appSecret,
        },
      });
    },
  };
};
