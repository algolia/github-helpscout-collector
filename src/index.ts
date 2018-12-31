import { join } from 'path';
import { RequestHandler, send, json } from 'micro';
import { mount } from './database';
import { findMailboxId } from './findMailboxId';

const databasePath =
  process.env.DATABASE_PATH || join(__dirname, '..', 'databases', 'data.test.json');

type IssueEventPayload = {
  action: string;
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

  return send(res, 201);
};

export default run;
