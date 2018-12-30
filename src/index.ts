import { RequestHandler, createError, json, send } from 'micro';

type IssueEventPayload = {
  action: string;
};

const run: RequestHandler = async (req, res) => {
  const githubEventTypeHeader = req.headers['x-github-event'];

  // Only support `issues` event
  if (!githubEventTypeHeader || githubEventTypeHeader !== 'issues') {
    throw createError(400, 'Only the event `issues` is supported by the hook');
  }

  const body = (await json(req)) as IssueEventPayload;

  // Only support `created` action
  if (body.action !== 'created') {
    throw createError(400, 'Only the action `created` is supported by the hook');
  }

  send(res, 201);
};

export default run;
