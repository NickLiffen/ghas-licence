import { Octokit } from "@octokit/action";

export const octokit = async (url: string): Promise<Octokit> =>
  new Octokit({ baseUrl: url });
