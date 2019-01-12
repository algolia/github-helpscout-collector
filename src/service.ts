import { join } from 'path';
import { existsSync } from 'fs';
import { RequestHandler, createError, text, json, send } from 'micro';
import { validateGithubSignature } from './githubSignature';
import { mount } from './database';
import { findMailboxId } from './findMailboxId';
import { createHelpScoutClient } from './helpScoutClient';
import { formatText } from './helpScoutTemplate';

const githubWebhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'mySuperSecretToken';

const helpScoutAppId = process.env.HELP_SCOUT_APP_ID || '';
const helpScoutAppSecret = process.env.HELP_SCOUT_APP_SECRET || '';

const databaseName = process.env.NODE_ENV === 'test' ? 'data.test.json' : 'data.json';
const databasePath = join(__dirname, '..', 'databases', databaseName);

if (!databaseName || !existsSync(databasePath)) {
  throw new Error('The database `data` does not exist, please create it before running the server');
}

type IssueEventPayload = {
  action: string;
  issue: {
    title: string;
    html_url: string;
    body: string;
  };
  repository: {
    id: number;
  };
};

const service: RequestHandler = async (req, res) => {
  if (!req.method || req.method !== 'POST') {
    throw createError(405, 'Only `POST` requests are allowed on this endpoint');
  }

  const [isValidGithubSignature] = validateGithubSignature({
    secret: githubWebhookSecret,
    headers: req.headers,
    payload: await text(req),
  });

  if (!isValidGithubSignature) {
    throw createError(401, 'Only GitHub requests are allowed on this endpoint');
  }

  const githubEventTypeHeader = req.headers['x-github-event'];

  if (!githubEventTypeHeader || githubEventTypeHeader !== 'issues') {
    return send(res, 202, 'Only the event `issues` is supported by the hook');
  }

  const body = (await json(req)) as IssueEventPayload;

  if (body.action !== 'opened') {
    return send(res, 202, 'Only the action `opened` is supported by the hook');
  }

  const database = await mount(databasePath);

  const mailboxId = findMailboxId(database, body.repository.id);

  if (mailboxId === null) {
    return send(res, 202, `The hook does not support the repo: "${body.repository.id}"`);
  }

  const helpScoutClient = createHelpScoutClient({
    appId: helpScoutAppId,
    appSecret: helpScoutAppSecret,
  });

  const { data: reponseAccessToken } = await helpScoutClient.getAccessToken();

  await helpScoutClient.createCustomerConversation({
    accessToken: reponseAccessToken.access_token,
    conversation: {
      mailboxId,
      subject: body.issue.title,
      customer: {
        email: 'support+github@algolia.com',
      },
      text: formatText({
        content: body.issue.body,
        link: body.issue.html_url,
      }),
      tags: ['github'],
    },
  });

  return send(res, 201, 'The GitHub issue has been pushed to HelpScout');
};

export default service;
