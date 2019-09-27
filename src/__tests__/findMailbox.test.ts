import { Db } from '../database';
import { findMailbox } from '../findMailbox';

describe('findMailbox', () => {
  it('expect the mailboxId to be a number when it exist', () => {
    const repoId = 20;
    const database: Db = {
      data: [{ mailboxId: 15, repositories: [20, 21] }],
    };

    const expectation = 15;
    const actual = findMailbox(database, repoId);

    expect(actual!.mailboxId).toBe(expectation);
  });

  it('expect the assignTo to be undefined when it exist (but empty)', () => {
    const repoId = 20;
    const database: Db = {
      data: [{ mailboxId: 15, repositories: [20, 21] }],
    };

    const expectation = undefined;
    const actual = findMailbox(database, repoId);

    expect(actual!.assignTo).toBe(expectation);
  });

  it('expect the assignTo to be a number when it exist', () => {
    const repoId = 20;
    const database: Db = {
      data: [{ mailboxId: 15, assignTo: 420, repositories: [20, 21] }],
    };

    const actual = findMailbox(database, repoId);

    expect(actual!.assignTo).toBe(420);
  });

  it('expect the response to be null when it does not exist', () => {
    const repoId = 100;
    const database: Db = {
      data: [{ mailboxId: 15, repositories: [20, 21] }],
    };

    const actual = findMailbox(database, repoId);

    expect(actual).toBe(null);
  });

  it('expect the mailboxId to be null when database is empty', () => {
    const repoId = 100;
    const database: Db = {
      data: [],
    };

    const expectation = null;
    const actual = findMailbox(database, repoId);

    expect(actual).toBe(expectation);
  });
});
