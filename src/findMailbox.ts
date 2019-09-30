import { Mailbox } from './createService';

export const findMailbox = (mailboxes: Mailbox[], repoId: number): Mailbox | null => {
  const mailbox = mailboxes.find(({ repositories }) => repositories.some(id => id === repoId));

  if (!mailbox) {
    return null;
  }

  return mailbox;
};
