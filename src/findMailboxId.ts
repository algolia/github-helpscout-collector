import { Db } from './database';

export const findMailboxId = (database: Db, repoId: number): number | null => {
  const [mailboxId = null] = database.data.find(([_, ids]) => ids.some(id => id === repoId)) || [];

  return mailboxId;
};
