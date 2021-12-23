import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import { run } from "./utils/discover";

import { octokit, getInputs, Octokit } from "./utils/general";

const main = async (): Promise<void> => {
  /* Load the Inputs or process.env */
  const [org, token, url, level, action] = await getInputs();

  /* Setting the octokit client */
  const client = (await octokit(token, url)) as Octokit;

  /* Run discover */
  action === "discover" ? await run(client, org, level) : null;
};

main();
