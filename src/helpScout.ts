import axios, { AxiosResponse } from 'axios';

type HScoutClientOptions = {
  appId: string;
  appSecret: string;
};

type HScoutResponse<T> = Promise<AxiosResponse<T>>;

type HScoutRequestOptions = {
  endpoint: string;
  method: 'POST';
  body: any;
  headers?: {
    [key: string]: string;
  };
};

type HScoutAccessTokenReponse = {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
};

type HScoutCustomerConversationOptions = {
  accessToken: string;
  conversation: {
    subject: string;
    mailboxId: number;
    customer: {
      email: string;
    };
    text: string;
    tags: string[];
    status?: string;
    type?: string;
  };
};

export const createHelpScoutClient = (clientOptions: HScoutClientOptions) => {
  const request: <T>(options: HScoutRequestOptions) => HScoutResponse<T> = ({
    endpoint,
    body,
    headers = {},
  }) =>
    axios.post(`https://api.helpscout.net/v2${endpoint}`, body, {
      headers,
    });

  return {
    getAccessToken(): HScoutResponse<HScoutAccessTokenReponse> {
      return request<HScoutAccessTokenReponse>({
        endpoint: '/oauth2/token',
        method: 'POST',
        body: {
          grant_type: 'client_credentials',
          client_id: clientOptions.appId,
          client_secret: clientOptions.appSecret,
        },
      });
    },

    createCustomerConversation(options: HScoutCustomerConversationOptions): HScoutResponse<void> {
      const { accessToken, conversation } = options;
      const { customer, text, type = 'email', status = 'active', ...rest } = conversation;

      const threads = [
        {
          type: 'customer',
          customer,
          text,
        },
      ];

      return request<void>({
        endpoint: '/conversations',
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        body: {
          ...rest,
          type,
          customer,
          threads,
          status,
        },
      });
    },
  };
};
