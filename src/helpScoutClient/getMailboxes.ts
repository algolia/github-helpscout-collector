import { HelpScoutRequester } from './requester';

export type HelpScoutMailboxesOptions = {
  accessToken: string;
};

export type HelpScoutMailbox = {
  id: number;
  name: string;
  slug: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type HelpScoutMailboxesReponse = {
  _embedded: {
    mailboxes: HelpScoutMailbox[];
  };
};

export const getMailboxes = (requester: HelpScoutRequester) => {
  return ({ accessToken }: HelpScoutMailboxesOptions) => {
    return requester.request<HelpScoutMailboxesReponse>({
      endpoint: '/mailboxes',
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  };
};
