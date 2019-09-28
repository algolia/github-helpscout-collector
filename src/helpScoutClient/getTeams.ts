import { HelpScoutRequester } from './requester';

export type HelpScoutTeamsOptions = {
  accessToken: string;
};

export type HelpScoutTeam = {
  id: string;
  name: string;
  timezone: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  mention: string;
  initials: string;
};

export type HelpScoutTeamsReponse = {
  _embedded: {
    teams: HelpScoutTeam[];
  };
};

export const getTeams = (requester: HelpScoutRequester) => {
  return ({ accessToken }: HelpScoutTeamsOptions) => {
    return requester.request<HelpScoutTeamsReponse>({
      endpoint: '/teams',
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  };
};
