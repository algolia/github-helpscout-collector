import inquirer from 'inquirer';
import chalk from 'chalk';
import { createHelpScoutClient } from '../src/helpScoutClient';

type Answers = {
  helpScoutAppId: string;
  helpScoutAppSecret: string;
  helpScoutMailboxName: string;
};

const questions = [
  {
    type: 'input',
    name: 'helpScoutAppId',
    message: 'HelpScout App ID',
  },
  {
    type: 'input',
    name: 'helpScoutAppSecret',
    message: 'HelpScout App Secret',
  },
  {
    type: 'input',
    name: 'helpScoutMailboxName',
    message: 'HelpScout mailbox name',
  },
];

inquirer
  .prompt<Answers>(questions)
  .then(async ({ helpScoutAppId, helpScoutAppSecret, helpScoutMailboxName }) => {
    const helpScoutClient = createHelpScoutClient({
      appId: helpScoutAppId,
      appSecret: helpScoutAppSecret,
    });

    const { data: reponseAccessToken } = await helpScoutClient.getAccessToken();
    const { data: responseMailboxes } = await helpScoutClient.getMailboxes({
      accessToken: reponseAccessToken.access_token,
    });

    const mailboxes = responseMailboxes._embedded.mailboxes.filter(mailbox =>
      mailbox.name.toLowerCase().includes(helpScoutMailboxName)
    );

    if (mailboxes.length) {
      console.log();
      mailboxes.forEach(mailbox => {
        console.log(`📬 ${chalk.bold(mailbox.name)}: ${chalk.cyan(mailbox.id.toString())}`);
      });
      console.log();

      return;
    }

    console.log();
    responseMailboxes._embedded.mailboxes.forEach(mailbox => {
      console.log(`📬 ${chalk.bold(mailbox.name)}: ${chalk.cyan(mailbox.id.toString())}`);
    });
    console.log();
  });
