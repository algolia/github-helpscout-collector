import axios, { AxiosResponse } from 'axios';
import { HelpScoutClientOptions } from './index';

export type HelpScoutRequester = {
  appId: string;
  appSecret: string;
  request<T>(options: HelpScoutRequestOptions): HelpScoutResponse<T>;
};

type HelpScoutRequestOptions = {
  endpoint: string;
  method: 'GET' | 'POST';
  body?: any;
  headers?: {
    [key: string]: string;
  };
};

export type HelpScoutResponse<T> = Promise<AxiosResponse<T>>;

export const requester = (clientOptions: HelpScoutClientOptions): HelpScoutRequester => {
  const request: <T>(options: HelpScoutRequestOptions) => HelpScoutResponse<T> = ({
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
    ...clientOptions,
    request,
  };
};
