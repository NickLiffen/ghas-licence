import { Octokit } from "../general";

import { downloadArtefact } from "./";

export const run = async (client: Octokit, org: string): Promise<void> => {
  await downloadArtefact();
};
