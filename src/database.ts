import { readFile } from 'fs';
import { promisify } from 'util';

export type Db = {
  data: Array<[number, number[]]>;
};

const readFileAsync = promisify(readFile);

export const mount = async (path: string) => {
  return JSON.parse(await readFileAsync(path, { encoding: 'utf-8' })) as Db;
};
