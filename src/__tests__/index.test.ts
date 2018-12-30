import micro from 'micro';
import listen from 'test-listen';
import axios from 'axios';
import run from '../index';

describe('App', () => {
  it('expect to throw an error without the `X-GitHub-Event` header', async () => {
    expect.assertions(1);

    const endpoint = await listen(micro(run));

    try {
      await axios.post(endpoint, null, {
        headers: {
          'X-Github-Delivery': 'XXXX-XXXX-XXXX-XXXX',
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  it('expect to throw an error with the `X-GitHub-Event` header different than `issues`', async () => {
    expect.assertions(1);

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
    }
  });
});
