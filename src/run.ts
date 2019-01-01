import { join } from 'path';
import { existsSync } from 'fs';
import { RequestHandler, send, json } from 'micro';
import { mount } from './database';
import { findMailboxId } from './findMailboxId';
import { createHelpScoutClient } from './helpScoutClient';
import { formatText } from './helpScoutTemplate';

const helpScoutAppId = process.env.HELP_SCOUT_APP_ID || '';
const helpScoutAppSecret = process.env.HELP_SCOUT_APP_SECRET || '';

const databaseName = process.env.DATABASE_NAME || 'data.test.json';
const databasePath = join(__dirname, '..', 'databases', databaseName);

if (!existsSync(databasePath)) {
  throw new Error(`The database "${databaseName}" does not exist, please create it.`);
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

const run: RequestHandler = async (req, res) => {
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

export default run;
