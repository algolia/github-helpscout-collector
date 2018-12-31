import { join } from 'path';
import { writeFile, unlink } from 'fs';
import { promisify } from 'util';
import { mount, Db } from '../database';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

describe('database', () => {
  describe('mount', () => {
    it('expect to resolve, read and parse the JSON', async () => {
      const filePath = join(__dirname, '__tmp');

      const value: Db = {
        data: [[15, [20, 21]]],
      };

      await writeFileAsync(filePath, JSON.stringify(value));

      const database = await mount(filePath);

      expect(database).toEqual(value);

      await unlinkAsync(filePath);
    });
  });
});
