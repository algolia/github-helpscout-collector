import { Db } from '../database';
import { findMailboxId } from '../findMailboxId';

describe('findMailboxId', () => {
  it('expect the mailboxId to be a number when it exist', () => {
    const repoId = 20;
    const database: Db = {
      data: [[15, [20, 21]]],
    };

    const expectation = 15;
    const actual = findMailboxId(database, repoId);

    expect(actual).toBe(expectation);
  });

  it('expect the mailboxId to be null when it does not exist', () => {
    const repoId = 100;
    const database: Db = {
      data: [[15, [20, 21]]],
    };

    const expectation = null;
    const actual = findMailboxId(database, repoId);

    expect(actual).toBe(expectation);
  });

  it('expect the mailboxId to be null when database is empty', () => {
    const repoId = 100;
    const database: Db = {
      data: [],
    };

    const expectation = null;
    const actual = findMailboxId(database, repoId);

    expect(actual).toBe(expectation);
  });
});
