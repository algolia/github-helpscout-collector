import axios, { AxiosResponse } from 'axios';

type Mailbox = {
  id: number;
  name: string;
  slug: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type HScoutClientOptions = {
  appId: string;
  appSecret: string;
};

type HScoutResponse<T> = Promise<AxiosResponse<T>>;

type HScoutRequestOptions = {
  endpoint: string;
  method: 'GET' | 'POST';
  body?: any;
  headers?: {
    [key: string]: string;
  };
};

type HScoutAccessTokenReponse = {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
};

type HScoutMailboxesOptions = {
  accessToken: string;
};

type HScoutMailboxesReponse = {
  _embedded: {
    mailboxes: Mailbox[];
  };
};

type HScoutCustomerConversationOptions = {
  accessToken: string;
  conversation: {
    subject: string;
    mailboxId: number;
    assignTo?: number;
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
    method,
    body,
    headers = {},
  }) =>
    axios.request({
      url: `https://api.helpscout.net/v2${endpoint}`,
      data: body,
      headers,
      method,
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

    getMailboxes(options: HScoutMailboxesOptions): HScoutResponse<HScoutMailboxesReponse> {
      const { accessToken } = options;

      return request<HScoutMailboxesReponse>({
        endpoint: '/mailboxes',
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
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
