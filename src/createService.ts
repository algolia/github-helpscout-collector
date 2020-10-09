import { RequestHandler, createError, text, json, send } from 'micro';
import { validateGithubSignature } from './githubSignature';
import { findMailbox } from './findMailbox';
import { HelpScoutClient } from './helpScoutClient';
import { formatText } from './helpScoutTemplate';
import { encodeHTML } from './encodeHTML';

export type ServiceConfiguration = {
  githubWebhookSecret: string;
  helpScoutClient: HelpScoutClient;
  helpScoutMailboxes: {
    data: Mailbox[];
  };
};

export type Mailbox = {
  mailboxId: number;
  assignTo?: number;
  repositories: number[];
};

type IssueEventPayload = {
  action: string;
  issue: {
    title: string;
    html_url: string;
    body: string;
  };
  repository: {
    id: number;
  };
};

const supportedPayloads = ['issues', 'discussions'];

export const createService: (configuration: ServiceConfiguration) => RequestHandler = ({
  githubWebhookSecret,
  helpScoutClient,
  helpScoutMailboxes,
}) => {
  return async (req, res) => {
    if (!req.method || req.method !== 'POST') {
      res.setHeader('Allow', 'POST');

      throw createError(405, 'Only `POST` requests are allowed on this endpoint');
    }

    const [isValidGithubSignature] = validateGithubSignature({
      secret: githubWebhookSecret,
      headers: req.headers,
      payload: await text(req),
    });

    if (!isValidGithubSignature) {
      throw createError(401, 'Only GitHub requests are allowed on this endpoint');
    }

    const githubEventTypeHeader = req.headers['x-github-event'];

    if (!githubEventTypeHeader || !supportedPayloads.includes(githubEventTypeHeader)) {
      return send(res, 202, 'Only the events ${supportedPayloads.join(', '} are supported by the hook');
    }

    const body = (await json(req)) as IssueEventPayload;

    if (body.action !== 'opened') {
      return send(res, 202, 'Only the action `opened` is supported by the hook');
    }

    const mailbox = findMailbox(helpScoutMailboxes.data, body.repository.id);

    if (!mailbox) {
      return send(res, 202, `The hook does not support the repo: "${body.repository.id}"`);
    }

    const { mailboxId, assignTo } = mailbox;

    const { data: responseAccessToken } = await helpScoutClient.getAccessToken();

    await helpScoutClient.createCustomerConversation({
      accessToken: responseAccessToken.access_token,
      conversation: {
        mailboxId,
        assignTo,
        subject: encodeHTML(body.issue.title),
        customer: {
          email: 'support+github@algolia.com',
        },
        text: formatText({
          content: body.issue.body,
          link: body.issue.html_url,
        }),
        tags: ['github'],
      },
    });

    return send(res, 201, 'The GitHub issue has been pushed to HelpScout');
  };
};
