import crypto from 'crypto';
import micro from 'micro';
import axios from 'axios';
import listen from 'test-listen';
import { createHelpScoutClient } from '../helpScoutClient';
import service from '../service';

jest.mock('../helpScoutClient', () => ({
  createHelpScoutClient: jest.fn(),
}));

describe('service', () => {
  const createGithubSignature = ({ secrect, payload }: { secrect: string; payload: string }) => {
    const digest = crypto
      .createHmac('sha1', secrect)
      .update(payload)
      .digest('hex');

    return `sha1=${digest}`;
  };

  const request = ({ endpoint = '', method = 'POST', body = {}, headers = {} }) =>
    axios(endpoint, {
      data: body,
      method,
      headers,
    });

  const requestWithGithubSignature = ({ body = {}, headers = {}, ...rest }) => {
    return request({
      ...rest,
      headers: {
        ...headers,
        'X-Hub-Signature': createGithubSignature({
          secrect: 'mySuperSecretToken',
          payload: JSON.stringify(body),
        }),
      },
      body,
    });
  };

  const requestWithIssuesEvent = ({ headers = {}, ...rest }) =>
    requestWithGithubSignature({
      ...rest,
      headers: {
        'X-GitHub-Event': 'issues',
        ...headers,
      },
    });

  it('expext to return a 405 with a method different than `POST`', async () => {
    expect.assertions(6);

    const server = micro(service);
    const endpoint = await listen(server);

    try {
      await request({ endpoint, method: 'GET' });
    } catch ({ response }) {
      expect(response.status).toBe(405);
      expect(response.data).toMatchInlineSnapshot(
        `"Only \`POST\` requests are allowed on this endpoint"`
      );
    }

    try {
      await request({ endpoint, method: 'PUT' });
    } catch ({ response }) {
      expect(response.status).toBe(405);
      expect(response.data).toMatchInlineSnapshot(
        `"Only \`POST\` requests are allowed on this endpoint"`
      );
    }

    try {
      await request({ endpoint, method: 'DELETE' });
    } catch ({ response }) {
      expect(response.status).toBe(405);
      expect(response.data).toMatchInlineSnapshot(
        `"Only \`POST\` requests are allowed on this endpoint"`
      );
    }

    server.close();
  });

  it('expext to return a 401 with a signature that is not valid', async () => {
    expect.assertions(2);

    const server = micro(service);
    const endpoint = await listen(server);

    try {
      await request({ endpoint });
    } catch ({ response }) {
      expect(response.status).toBe(401);
      expect(response.data).toMatchInlineSnapshot(
        `"Only GitHub requests are allowed on this endpoint"`
      );
    }

    server.close();
  });

  it('expect to return a 202 without the `X-GitHub-Event` header', async () => {
    const server = micro(service);
    const endpoint = await listen(server);
    const response = await requestWithGithubSignature({ endpoint });

    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(
      `"Only the event \`issues\` is supported by the hook"`
    );

    server.close();
  });

  it('expect to return a 202 with the `X-GitHub-Event` header different than `issues`', async () => {
    const server = micro(service);
    const endpoint = await listen(server);

    {
      const response = await requestWithGithubSignature({
        endpoint,
        headers: {
          'X-GitHub-Event': 'membership',
        },
      });

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the event \`issues\` is supported by the hook"`
      );
    }

    {
      const response = await requestWithGithubSignature({
        endpoint,
        headers: {
          'X-GitHub-Event': 'issue_comment',
        },
      });

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the event \`issues\` is supported by the hook"`
      );
    }

    server.close();
  });

  it('expect to return a 202 with an `action` different than `opened`', async () => {
    const server = micro(service);
    const endpoint = await listen(server);

    {
      const response = await requestWithIssuesEvent({
        endpoint,
        body: {
          action: 'deleted',
        },
      });

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the action \`opened\` is supported by the hook"`
      );
    }

    {
      const response = await requestWithIssuesEvent({
        endpoint,
        body: {
          action: 'edited',
        },
      });

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the action \`opened\` is supported by the hook"`
      );
    }

    server.close();
  });

  it('expect to return a 202 for a repo that does not exist', async () => {
    const server = micro(service);
    const endpoint = await listen(server);
    const response = await requestWithIssuesEvent({
      endpoint,
      body: {
        action: 'opened',
        repository: {
          id: 12345,
        },
      },
    });

    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(
      `"The hook does not support the repo: \\"12345\\""`
    );

    server.close();
  });

  it('expect to return a 201 that creates a HelpScout conversation', async () => {
    const getAccessToken = jest.fn(() =>
      Promise.resolve({
        data: {
          access_token: 'YOUR_ACCESS_TOKEN',
        },
      })
    );

    const createCustomerConversation = jest.fn(() => Promise.resolve());

    (createHelpScoutClient as jest.Mock).mockImplementation(() => ({
      getAccessToken,
      createCustomerConversation,
    }));

    const server = micro(service);
    const endpoint = await listen(server);

    const response = await requestWithIssuesEvent({
      endpoint,
      body: {
        action: 'opened',
        issue: {
          title: 'Spelling error in the README file',
          html_url: 'https://github.com/Codertocat/Hello-World/issues/2',
          body: 'It looks like you accidently spelled commit with two t.',
        },
        repository: {
          id: 67891,
        },
      },
    });

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(createCustomerConversation).toHaveBeenCalledTimes(1);
    expect(createCustomerConversation).toHaveBeenCalledWith({
      accessToken: 'YOUR_ACCESS_TOKEN',
      conversation: expect.objectContaining({
        subject: 'Spelling error in the README file',
        mailboxId: 15,
        customer: {
          email: 'support+github@algolia.com',
        },
        tags: ['github'],
      }),
    });

    expect(createCustomerConversation).toHaveBeenCalledWith(
      expect.objectContaining({
        conversation: expect.objectContaining({
          text: expect.stringContaining('It looks like you accidently spelled commit with two t.'),
        }),
      })
    );

    expect(createCustomerConversation).toHaveBeenCalledWith(
      expect.objectContaining({
        conversation: expect.objectContaining({
          text: expect.stringContaining('https://github.com/Codertocat/Hello-World/issues/2'),
        }),
      })
    );

    expect(response.status).toBe(201);
    expect(response.data).toMatchInlineSnapshot(`"The GitHub issue has been pushed to HelpScout"`);

    server.close();
  });
});
