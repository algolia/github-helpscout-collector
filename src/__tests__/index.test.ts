import micro from 'micro';
import listen from 'test-listen';
import axios from 'axios';
import run from '../index';

describe('App', () => {
  it('expect to return a 202 without the `X-GitHub-Event` header', async () => {
    const endpoint = await listen(micro(run));
    const response = await axios.post(endpoint, null, {
      headers: {
        'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
      },
    });

    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(
      `"Only the event \`issues\` is supported by the hook"`
    );
  });

  it('expect to return 202 with the `X-GitHub-Event` header different than `issues`', async () => {
    const endpoint = await listen(micro(run));
    const response = await axios.post(endpoint, null, {
      headers: {
        'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
        'X-GitHub-Event': 'membership',
      },
    });

    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(
      `"Only the event \`issues\` is supported by the hook"`
    );
  });

  it('expect to return a 202 with an `action` different than `created`', async () => {
    const endpoint = await listen(micro(run));

    {
      const response = await axios.post(
        endpoint,
        {
          action: 'deleted',
        },
        {
          headers: {
            'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
            'X-GitHub-Event': 'issues',
          },
        }
      );

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the action \`created\` is supported by the hook"`
      );
    }

    {
      const response = await axios.post(
        endpoint,
        {
          action: 'edited',
        },
        {
          headers: {
            'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
            'X-GitHub-Event': 'issues',
          },
        }
      );

      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(
        `"Only the action \`created\` is supported by the hook"`
      );
    }
  });
});
