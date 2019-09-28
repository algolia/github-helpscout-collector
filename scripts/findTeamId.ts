import inquirer from 'inquirer';
import chalk from 'chalk';
import { createHelpScoutClient } from '../src/helpScoutClient';

type Answers = {
  helpScoutAppId: string;
  helpScoutAppSecret: string;
  helpScoutTeamName: string;
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
    name: 'helpScoutTeamName',
    message: 'HelpScout team name',
  },
];

inquirer
  .prompt<Answers>(questions)
  .then(async ({ helpScoutAppId, helpScoutAppSecret, helpScoutTeamName }) => {
    const helpScoutClient = createHelpScoutClient({
      appId: helpScoutAppId,
      appSecret: helpScoutAppSecret,
    });

    const { data: reponseAccessToken } = await helpScoutClient.getAccessToken();
    const { data: responseTeams } = await helpScoutClient.getTeams({
      accessToken: reponseAccessToken.access_token,
    });

    const teams = responseTeams._embedded.teams.filter(team =>
      team.name.toLowerCase().includes(helpScoutTeamName.toLowerCase())
    );

    if (teams.length) {
      console.log();
      teams.forEach(team => {
        console.log(`👥 ${chalk.bold(team.name)}: ${chalk.cyan(team.id.toString())}`);
      });
      console.log();

      return;
    }

    console.log();
    responseTeams._embedded.teams.forEach(team => {
      console.log(`👥 ${chalk.bold(team.name)}: ${chalk.cyan(team.id.toString())}`);
    });
    console.log();
  });
