import * as nock from 'nock';
import { createHelpScoutClient } from '../helpScout';

const helpScoutNock = nock('https://api.helpscout.net/v2');

describe('helpScout', () => {
  describe('getAccessToken', () => {
    it('expect to return a new token', async () => {
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

      expect(response).toEqual({
        token_type: 'bearer',
        access_token: 'c03b444bd51f42a5aa98fa992e27ba8f',
        expires_in: 7200,
      });
    });
  });
});
