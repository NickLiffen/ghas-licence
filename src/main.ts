import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import { run as discover } from "./utils/discover";

import { run as disable } from "./utils/disable";

import { octokit, getInputs, Octokit } from "./utils/general";

const main = async (): Promise<void> => {
  /* Load the Inputs or process.env */
  const [org, url, level, dryRun] = await getInputs();

  /* Setting the octokit client */
  const client = (await octokit(url)) as Octokit;

  try {
    /* Run discover */
    const data = await discover(client, org, level);
    console.log(dryRun);
    /* Run disable if not set to a dry run */
    dryRun === "false" ? await disable(client, data) : null;
  } catch (error) {
    console.error(error);
  }
};

main();
