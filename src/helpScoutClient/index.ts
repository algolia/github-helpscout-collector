import { requester } from './requester';
import { createCustomerConversation } from './createCustomerConversation';
import { getAccessToken } from './getAccessToken';
import { getMailboxes } from './getMailboxes';
import { getTeams } from './getTeams';

export type HelpScoutClient = ReturnType<typeof createHelpScoutClient>;

export type HelpScoutClientOptions = {
  appId: string;
  appSecret: string;
};

export const createHelpScoutClient = (clientOptions: HelpScoutClientOptions) => {
  const r = requester(clientOptions);

  return {
    createCustomerConversation: createCustomerConversation(r),
    getAccessToken: getAccessToken(r),
    getMailboxes: getMailboxes(r),
    getTeams: getTeams(r),
  };
};
