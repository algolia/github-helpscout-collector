import { HelpScoutRequester } from './requester';

export type HelpScoutCustomerConversationOptions = {
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

export const createCustomerConversation = (requester: HelpScoutRequester) => {
  return ({ accessToken, conversation }: HelpScoutCustomerConversationOptions) => {
    const { customer, text, type = 'email', status = 'active', ...rest } = conversation;

    const threads = [
      {
        type: 'customer',
        customer,
        text,
      },
    ];

    return requester.request<void>({
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
  };
};
