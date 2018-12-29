import { RequestHandler } from 'micro';

const run: RequestHandler = () => {
  return 'Hello World';
};

export default run;
