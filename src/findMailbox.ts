import { Db, Datum } from './database';

export const findMailbox = (database: Db, repoId: number): Datum | null => {
  const mailbox = database.data.find(({ repositories }) => repositories.some(id => id === repoId));

  if (!mailbox) {
    return null;
  }

  return mailbox;
};
