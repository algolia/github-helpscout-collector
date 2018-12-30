import { RequestHandler, send, json } from 'micro';

type IssueEventPayload = {
  action: string;
};

const run: RequestHandler = async (req, res) => {
  const githubEventTypeHeader = req.headers['x-github-event'];

  // Only support `issues` event
  if (!githubEventTypeHeader || githubEventTypeHeader !== 'issues') {
    return send(res, 202, 'Only the event `issues` is supported by the hook');
  }

  const body = (await json(req)) as IssueEventPayload;

  // Only support `created` action
  if (body.action !== 'created') {
    return send(res, 202, 'Only the action `created` is supported by the hook');
  }

  return send(res, 201);
};

export default run;
