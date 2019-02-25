import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';

type Rel = 'prev' | 'next' | 'first' | 'last';
type Link = [string, Rel];

type Repository = {
  id: number;
  full_name: string;
};

type Answers = {
  githubOrgName: string;
  githubRepoName: string;
};

const getLinks = (links: string): Link[] =>
  links
    .split(', ')
    .map(_ => _.split('; '))
    .map(([link, _]) => [link.substring(1, link.length - 1), _])
    .map<Link>(([_, rel]) => [_, rel.substring('rel="'.length, rel.length - 1) as Rel]);

const getEndpoint = (links: Link[], rel: Rel): string => {
  const [link = ''] = links.find(([_, r]) => r === rel) || [];

  return link;
};

const getOrgRepos = (githubOrgName: string): Promise<Repository[]> => {
  type Args = {
    endpoint: string;
    state: Repository[];
  };

  const loop = async ({ endpoint, state }: Args): Promise<Repository[]> => {
    const response = await axios.request<Repository[]>({
      url: endpoint,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const nextPage = getEndpoint(getLinks(response.headers.link), 'next');
    const nextState = state.concat(response.data);

    if (!nextPage) {
      return nextState;
    }

    return loop({
      endpoint: nextPage,
      state: nextState,
    });
  };

  return loop({
    endpoint: `https://api.github.com/orgs/${githubOrgName}/repos`,
    state: [],
  });
};

const questions = [
  {
    type: 'input',
    name: 'githubOrgName',
    message: 'GitHub organization',
  },
  {
    type: 'input',
    name: 'githubRepoName',
    message: 'GitHub repo name',
  },
];

inquirer.prompt<Answers>(questions).then(async ({ githubOrgName, githubRepoName }) => {
  const reposForOrg = await getOrgRepos(githubOrgName);

  const reposForName = reposForOrg.filter(repo =>
    repo.full_name.toLowerCase().includes(githubRepoName)
  );

  if (reposForName.length) {
    console.log();
    reposForName.forEach(repo => {
      console.log(`📚 ${chalk.bold(repo.full_name)}: ${chalk.cyan(repo.id.toString())}`);
    });
    console.log();

    return;
  }

  console.log();
  reposForOrg.forEach(repo => {
    console.log(`📚 ${chalk.bold(repo.full_name)}: ${chalk.cyan(repo.id.toString())}`);
  });
  console.log();
});
