import * as modules from '../githubSignature';

describe('githubSignature', () => {
  describe('validateGithubSignature', () => {
    it('returns `false` for headers without `X-Hub-Signature`', () => {
      const input = {
        secret: 'mySuperSecretToken',
        payload: '',
        headers: {},
      };

      const [value, message] = modules.validateGithubSignature(input);

      expect(value).toBe(false);
      expect(message).toMatchInlineSnapshot(
        `"The headers does not contain a valid \\"X-Hub-Signature\\" attribute"`
      );
    });

    it('returns `false` for an algorithm that does not matches `sha1`', () => {
      const input = {
        secret: 'mySuperSecretToken',
        payload: '',
        headers: {
          'x-hub-signature': 'md5=xxx',
        },
      };

      const [value, message] = modules.validateGithubSignature(input);

      expect(value).toBe(false);
      expect(message).toMatchInlineSnapshot(
        `"The algorithm \\"md5\\" does not match the one expected"`
      );
    });

    it('returns `false` for a payload digest length that does not matches the signature digest length', () => {
      const input = {
        secret: 'mySuperSecretToken',
        payload: 'FakeContent',
        headers: {
          'x-hub-signature': 'sha1=FakeSignature',
        },
      };

      const [value, message] = modules.validateGithubSignature(input);

      expect(value).toBe(false);
      expect(message).toMatchInlineSnapshot(
        `"The payload digest length does not match the signature digest length"`
      );
    });

    it('returns `false` for a payload digest that does not matches the signature digest', () => {
      const input = {
        secret: 'mySuperSecretTokenThatDontMatch',
        payload: githubSignedPayload,
        headers: {
          'x-hub-signature': 'sha1=ff04ac57f20b9d1c41856366fe779fb1ff50ce12',
        },
      };

      const [value, message] = modules.validateGithubSignature(input);

      expect(value).toBe(false);
      expect(message).toMatchInlineSnapshot(
        `"The payload digest does not match the signature digest"`
      );
    });

    it('returns `true` for a payload digest that matches the signature digest', () => {
      const input = {
        secret: 'mySuperSecretToken',
        payload: githubSignedPayload,
        headers: {
          'x-hub-signature': 'sha1=ff04ac57f20b9d1c41856366fe779fb1ff50ce12',
        },
      };

      const [value, message] = modules.validateGithubSignature(input);

      expect(value).toBe(true);
      expect(message).toBe(null);
    });
  });
});

const githubSignedPayload = JSON.stringify({
  zen: 'Mind your words, they are important.',
  hook_id: 74455950,
  hook: {
    type: 'Repository',
    id: 74455950,
    name: 'web',
    active: true,
    events: ['issues'],
    config: {
      content_type: 'json',
      insecure_ssl: '0',
      secret: '********',
      url: 'https://11f69cdc.ngrok.io/',
    },
    updated_at: '2019-01-02T18:13:16Z',
    created_at: '2019-01-02T18:13:16Z',
    url: 'https://api.github.com/repos/samouss/github-webhook-collector/hooks/74455950',
    test_url: 'https://api.github.com/repos/samouss/github-webhook-collector/hooks/74455950/test',
    ping_url: 'https://api.github.com/repos/samouss/github-webhook-collector/hooks/74455950/pings',
    last_response: {
      code: null,
      status: 'unused',
      message: null,
    },
  },
  repository: {
    id: 163651661,
    node_id: 'MDEwOlJlcG9zaXRvcnkxNjM2NTE2NjE=',
    name: 'github-webhook-collector',
    full_name: 'samouss/github-webhook-collector',
    private: false,
    owner: {
      login: 'samouss',
      id: 6513513,
      node_id: 'MDQ6VXNlcjY1MTM1MTM=',
      avatar_url: 'https://avatars2.githubusercontent.com/u/6513513?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/samouss',
      html_url: 'https://github.com/samouss',
      followers_url: 'https://api.github.com/users/samouss/followers',
      following_url: 'https://api.github.com/users/samouss/following{/other_user}',
      gists_url: 'https://api.github.com/users/samouss/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/samouss/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/samouss/subscriptions',
      organizations_url: 'https://api.github.com/users/samouss/orgs',
      repos_url: 'https://api.github.com/users/samouss/repos',
      events_url: 'https://api.github.com/users/samouss/events{/privacy}',
      received_events_url: 'https://api.github.com/users/samouss/received_events',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/samouss/github-webhook-collector',
    description: null,
    fork: false,
    url: 'https://api.github.com/repos/samouss/github-webhook-collector',
    forks_url: 'https://api.github.com/repos/samouss/github-webhook-collector/forks',
    keys_url: 'https://api.github.com/repos/samouss/github-webhook-collector/keys{/key_id}',
    collaborators_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/samouss/github-webhook-collector/teams',
    hooks_url: 'https://api.github.com/repos/samouss/github-webhook-collector/hooks',
    issue_events_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/issues/events{/number}',
    events_url: 'https://api.github.com/repos/samouss/github-webhook-collector/events',
    assignees_url: 'https://api.github.com/repos/samouss/github-webhook-collector/assignees{/user}',
    branches_url: 'https://api.github.com/repos/samouss/github-webhook-collector/branches{/branch}',
    tags_url: 'https://api.github.com/repos/samouss/github-webhook-collector/tags',
    blobs_url: 'https://api.github.com/repos/samouss/github-webhook-collector/git/blobs{/sha}',
    git_tags_url: 'https://api.github.com/repos/samouss/github-webhook-collector/git/tags{/sha}',
    git_refs_url: 'https://api.github.com/repos/samouss/github-webhook-collector/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/samouss/github-webhook-collector/git/trees{/sha}',
    statuses_url: 'https://api.github.com/repos/samouss/github-webhook-collector/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/samouss/github-webhook-collector/languages',
    stargazers_url: 'https://api.github.com/repos/samouss/github-webhook-collector/stargazers',
    contributors_url: 'https://api.github.com/repos/samouss/github-webhook-collector/contributors',
    subscribers_url: 'https://api.github.com/repos/samouss/github-webhook-collector/subscribers',
    subscription_url: 'https://api.github.com/repos/samouss/github-webhook-collector/subscription',
    commits_url: 'https://api.github.com/repos/samouss/github-webhook-collector/commits{/sha}',
    git_commits_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/git/commits{/sha}',
    comments_url: 'https://api.github.com/repos/samouss/github-webhook-collector/comments{/number}',
    issue_comment_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/issues/comments{/number}',
    contents_url: 'https://api.github.com/repos/samouss/github-webhook-collector/contents/{+path}',
    compare_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/samouss/github-webhook-collector/merges',
    archive_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/samouss/github-webhook-collector/downloads',
    issues_url: 'https://api.github.com/repos/samouss/github-webhook-collector/issues{/number}',
    pulls_url: 'https://api.github.com/repos/samouss/github-webhook-collector/pulls{/number}',
    milestones_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/milestones{/number}',
    notifications_url:
      'https://api.github.com/repos/samouss/github-webhook-collector/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/samouss/github-webhook-collector/labels{/name}',
    releases_url: 'https://api.github.com/repos/samouss/github-webhook-collector/releases{/id}',
    deployments_url: 'https://api.github.com/repos/samouss/github-webhook-collector/deployments',
    created_at: '2018-12-31T08:17:10Z',
    updated_at: '2019-01-01T18:35:28Z',
    pushed_at: '2019-01-01T18:35:26Z',
    git_url: 'git://github.com/samouss/github-webhook-collector.git',
    ssh_url: 'git@github.com:samouss/github-webhook-collector.git',
    clone_url: 'https://github.com/samouss/github-webhook-collector.git',
    svn_url: 'https://github.com/samouss/github-webhook-collector',
    homepage: null,
    size: 162,
    stargazers_count: 0,
    watchers_count: 0,
    language: 'TypeScript',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    open_issues_count: 0,
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'master',
  },
  sender: {
    login: 'samouss',
    id: 6513513,
    node_id: 'MDQ6VXNlcjY1MTM1MTM=',
    avatar_url: 'https://avatars2.githubusercontent.com/u/6513513?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/samouss',
    html_url: 'https://github.com/samouss',
    followers_url: 'https://api.github.com/users/samouss/followers',
    following_url: 'https://api.github.com/users/samouss/following{/other_user}',
    gists_url: 'https://api.github.com/users/samouss/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/samouss/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/samouss/subscriptions',
    organizations_url: 'https://api.github.com/users/samouss/orgs',
    repos_url: 'https://api.github.com/users/samouss/repos',
    events_url: 'https://api.github.com/users/samouss/events{/privacy}',
    received_events_url: 'https://api.github.com/users/samouss/received_events',
    type: 'User',
    site_admin: false,
  },
});
