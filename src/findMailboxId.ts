import { Db } from './database';

export const findMailbox = (
  database: Db,
  repoId: number
): { mailboxId: number | null; assignTo?: number } => {
  const { mailboxId = null, assignTo = undefined } =
    database.data.find(({ repositories }) => repositories.some(id => id === repoId)) || {};

  return { mailboxId, assignTo };
};
