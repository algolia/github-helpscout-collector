import { createHmac, timingSafeEqual } from 'crypto';

const ALGO_TYPE = 'sha1';

type ValidateSignatureInput = {
  secret: string;
  payload: string;
  headers: {
    [key: string]: string | string[] | undefined;
  };
};

type ValidateSignatureOutput = [boolean, string | null];

export const validateGithubSignature = (input: ValidateSignatureInput): ValidateSignatureOutput => {
  const { secret, payload, headers } = input;
  const githubSignatureHeader = headers['x-hub-signature'];

  if (!githubSignatureHeader || typeof githubSignatureHeader !== 'string') {
    return [false, 'The headers does not contain a valid "X-Hub-Signature" attribute'];
  }

  const [algorithm, githubDigestHex] = githubSignatureHeader.split('=');

  if (algorithm !== ALGO_TYPE) {
    return [false, `The algorithm "${algorithm}" does not match the one expected`];
  }

  const payloadDigestBuffer = createHmac(algorithm, secret)
    .update(payload)
    .digest();

  const githubDigestBuffer = Buffer.from(githubDigestHex, 'hex');

  if (payloadDigestBuffer.length !== githubDigestBuffer.length) {
    return [false, 'The payload digest length does not match the signature digest length'];
  }

  const isSafeEqual = timingSafeEqual(payloadDigestBuffer, githubDigestBuffer);

  if (!isSafeEqual) {
    return [false, 'The payload digest does not match the signature digest'];
  }

  return [isSafeEqual, null];
};
