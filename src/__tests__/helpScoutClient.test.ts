import nock from 'nock';
import { createHelpScoutClient } from '../helpScoutClient';

const helpScoutNock = nock('https://api.helpscout.net/v2');

describe('helpScout', () => {
  describe('getAccessToken', () => {
    it('expect to return a token', async () => {
      helpScoutNock
        .post('/oauth2/token', {
          grant_type: 'client_credentials',
          client_id: 'YOUR_APP_ID',
          client_secret: 'YOUR_APP_SECRET',
        })
        .reply(200, {
          token_type: 'bearer',
          access_token: 'c03b444bd51f42a5aa98fa992e27ba8f',
          expires_in: 7200,
        });

      const client = createHelpScoutClient({
        appId: 'YOUR_APP_ID',
        appSecret: 'YOUR_APP_SECRET',
      });

      const response = await client.getAccessToken();

      expect(response.data).toEqual({
        token_type: 'bearer',
        access_token: 'c03b444bd51f42a5aa98fa992e27ba8f',
        expires_in: 7200,
      });
    });
  });

  describe('getMailboxes', () => {
    it('expect to return a list of mailbox', async () => {
      helpScoutNock.get('/mailboxes').reply(() => {
        return [
          200,
          {
            _embedded: {
              mailboxes: [
                {
                  name: 'Mailbox A',
                },
                {
                  name: 'Mailbox B',
                },
              ],
            },
          },
        ];
      });

      const client = createHelpScoutClient({
        appId: 'YOUR_APP_ID',
        appSecret: 'YOUR_APP_SECRET',
      });

      const response = await client.getMailboxes({
        accessToken: 'YOUR_ACCESS_TOKEN',
      });

      expect(response.data).toEqual({
        _embedded: {
          mailboxes: [
            {
              name: 'Mailbox A',
            },
            {
              name: 'Mailbox B',
            },
          ],
        },
      });
    });
  });

  describe('getTeams', () => {
    it('expect to return a list of teams', async () => {
      helpScoutNock.get('/teams').reply(() => {
        return [
          200,
          {
            _embedded: {
              teams: [
                {
                  name: 'Team A',
                },
                {
                  name: 'Team B',
                },
              ],
            },
          },
        ];
      });

      const client = createHelpScoutClient({
        appId: 'YOUR_APP_ID',
        appSecret: 'YOUR_APP_SECRET',
      });

      const response = await client.getTeams({
        accessToken: 'YOUR_ACCESS_TOKEN',
      });

      expect(response.data).toEqual({
        _embedded: {
          teams: [
            {
              name: 'Team A',
            },
            {
              name: 'Team B',
            },
          ],
        },
      });
    });
  });

  describe('createCustomerConversation', () => {
    it('expect to create a customer converstation', async () => {
      helpScoutNock
        .post('/conversations', {
          subject: 'Subject',
          type: 'email',
          mailboxId: 85,
          status: 'active',
          customer: {
            email: 'support+github@algolia.com',
          },
          threads: [
            {
              type: 'customer',
              customer: {
                email: 'support+github@algolia.com',
              },
              text: 'Hello, Help Scout. How are you?',
            },
          ],
          tags: ['github'],
        })
        .reply(() => {
          return [
            201,
            null,
            {
              'Resource-ID': 123,
              Location: 'https://api.helpscout.net/v2/conversations/123',
            },
          ];
        });

      const client = createHelpScoutClient({
        appId: 'YOUR_APP_ID',
        appSecret: 'YOUR_APP_SECRET',
      });

      const response = await client.createCustomerConversation({
        accessToken: 'YOUR_ACCESS_TOKEN',
        conversation: {
          subject: 'Subject',
          mailboxId: 85,
          customer: {
            email: 'support+github@algolia.com',
          },
          text: 'Hello, Help Scout. How are you?',
          tags: ['github'],
        },
      });

      expect(response.headers).toEqual({
        'Resource-ID': 123,
        Location: 'https://api.helpscout.net/v2/conversations/123',
      });
    });
  });
});
