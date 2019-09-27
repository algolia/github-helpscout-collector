import { readFile } from 'fs';
import { promisify } from 'util';

export type Datum = {
  mailboxId: number;
  assignTo?: number;
  repositories: number[];
};

export type Db = {
  data: Datum[];
};

const readFileAsync = promisify(readFile);

export const mount = async (path: string) => {
  return JSON.parse(await readFileAsync(path, { encoding: 'utf-8' })) as Db;
};
