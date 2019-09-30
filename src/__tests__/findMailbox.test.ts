import { Mailbox } from '../createService';
import { findMailbox } from '../findMailbox';

describe('findMailbox', () => {
  it('expect to return a mailbox with a `repoId` that match', () => {
    const repoId = 20;
    const mailboxes = [{ mailboxId: 15, repositories: [20, 21] }];

    const actual = findMailbox(mailboxes, repoId);

    expect(actual).toEqual({
      mailboxId: 15,
      repositories: [20, 21],
    });
  });

  it("expect to return `null` with a `repoId` that doesn't match", () => {
    const repoId = 100;
    const mailboxes = [{ mailboxId: 15, repositories: [20, 21] }];

    const actual = findMailbox(mailboxes, repoId);

    expect(actual).toBe(null);
  });

  it('expect to return `null` with data empty', () => {
    const repoId = 100;
    const mailboxes: Mailbox[] = [];

    const actual = findMailbox(mailboxes, repoId);

    expect(actual).toBe(null);
  });
});
