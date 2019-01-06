# GitHub Webook Collector

This is a server to collect `issues` events from GitHub through [webhooks](https://developer.github.com/webhooks/) and sent them to [HelpScout](https://helpscout.com) with the [Mailbox API 2.0](https://developer.helpscout.com/mailbox-api/). To link repositories to mailboxes we use the file [`data.json`](data.json) as database. The stucture looks like this:

```json
{
  "data": [
    [
      "<mailboxId>",
      [
        "<repoId>",
        "<repoId>"
      ]
    ],
  ]
}
```

### Run the production server

```
GITHUB_WEBHOOK_SECRET=yourGitHubWebTokenSecret \
HELP_SCOUT_APP_ID=yourHelpScoutAppId \
HELP_SCOUT_APP_SECRET=yourHelpScoutAppSecrect \
yarn start
```

### Run the devlopment server

```
GITHUB_WEBHOOK_SECRET=yourGitHubWebTokenSecret \
HELP_SCOUT_APP_ID=yourHelpScoutAppId \
HELP_SCOUT_APP_SECRET=yourHelpScoutAppSecrect \
yarn dev
```

### Run the build

```
yarn build
```

### Run the test

```
yarn test
```
