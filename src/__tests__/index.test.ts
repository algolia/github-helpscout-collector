import micro from 'micro';
import axios from 'axios';
import listen from 'test-listen';
import run from '../index';

describe('App', () => {
  const request = ({ endpoint = '', body = {}, headers = {} }) =>
    axios.post(endpoint, body, { headers });

  const requestWithIssuesEvent = ({ headers = {}, ...rest }) =>
    request({
      ...rest,
      headers: {
        'X-GitHub-Event': 'issues',
        ...headers,
      },
    });

  it('expect to return a 202 without the `X-GitHub-Event` header', async () => {
    const endpoint = await listen(micro(run));
    const response = await request({ endpoint });

    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(
      `"Only the event \`issues\` is supported by the hook"`
    );
  });

  it('expect to return 202 with the `X-GitHub-Event` header different than `issues`', async () => {
    const endpoint = await listen(micro(run));

    {
      const response = await request({
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
      const response = await request({
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
  });

  it('expect to return a 202 with an `action` different than `created`', async () => {
    const endpoint = await listen(micro(run));

    {
      const response = await requestWithIssuesEvent({
        endpoint,
        body: {
          action: 'deleted',
        },
      });

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the action \`created\` is supported by the hook"`
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
        `"Only the action \`created\` is supported by the hook"`
      );
    }
  });
});
