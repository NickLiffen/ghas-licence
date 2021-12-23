import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import { run as discover } from "./utils/discover";

import { run as disable } from "./utils/disable";

import { octokit, getInputs, Octokit } from "./utils/general";

const main = async (): Promise<void> => {
  /* Load the Inputs or process.env */
  const [org, token, url, level, action] = await getInputs();

  /* Setting the octokit client */
  const client = (await octokit(token, url)) as Octokit;

  try {
    /* Run discover */
    action === "discover" ? await discover(client, org, level) : null;
  } catch (error) {
    console.error(error);
  }

  try {
    /* Run disable */
    action === "disable" ? await disable(client, org) : null;
  } catch (error) {
    console.error(error);
  }
};

main();
