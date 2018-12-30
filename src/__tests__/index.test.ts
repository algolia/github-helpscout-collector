import micro from 'micro';
import listen from 'test-listen';
import axios from 'axios';
import run from '../index';

describe('App', () => {
  it('expect to throw an error without the `X-GitHub-Event` header', async () => {
    expect.assertions(2);

    const endpoint = await listen(micro(run));

    try {
      await axios.post(endpoint, null, {
        headers: {
          'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchInlineSnapshot(
        `"Only the event \`issues\` is supported by the hook"`
      );
    }
  });

  it('expect to throw an error with the `X-GitHub-Event` header different than `issues`', async () => {
    expect.assertions(2);

    const endpoint = await listen(micro(run));

    try {
      await axios.post(endpoint, null, {
        headers: {
          'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
          'X-GitHub-Event': 'membership',
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchInlineSnapshot(
        `"Only the event \`issues\` is supported by the hook"`
      );
    }
  });

  it('expect to throw an error with an `action` different than `created`', async () => {
    expect.assertions(4);

    const endpoint = await listen(micro(run));

    try {
      await axios.post(
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
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchInlineSnapshot(
        `"Only the action \`created\` is supported by the hook"`
      );
    }

    try {
      await axios.post(
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
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchInlineSnapshot(
        `"Only the action \`created\` is supported by the hook"`
      );
    }
  });
});
