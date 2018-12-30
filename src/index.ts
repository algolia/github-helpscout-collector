import { RequestHandler, createError, send } from 'micro';

const run: RequestHandler = async (req, res) => {
  const githubEventTypeHeader = req.headers['x-github-event'];

  // Only support issues event
  if (!githubEventTypeHeader || githubEventTypeHeader !== 'issues') {
    throw createError(400, 'Request not supported');
  }

  send(res, 201);
};

export default run;
