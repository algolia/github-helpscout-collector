import { createHelpScoutClient } from './helpScoutClient';
import { createService } from './createService';

const githubWebhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'mySuperSecretToken';

const helpScoutAppId = process.env.HELP_SCOUT_APP_ID || '';
const helpScoutAppSecret = process.env.HELP_SCOUT_APP_SECRET || '';

const helpScoutMailboxes = (process.env.HELP_SCOUT_MAILBOXES &&
  JSON.parse(JSON.stringify(process.env.HELP_SCOUT_MAILBOXES))) || {
  data: [],
};

const helpScoutClient = createHelpScoutClient({
  appId: helpScoutAppId,
  appSecret: helpScoutAppSecret,
});

export default createService({
  githubWebhookSecret,
  helpScoutClient,
  helpScoutMailboxes,
});
