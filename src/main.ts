import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import * as core from "@actions/core";

import { billing, octokit, checkCodeScanning } from "./utils";

import { BillingAPIFunctionResponse } from "../types/common";

import { Octokit } from "./utils/octokitTypes";

const run = async (): Promise<void> => {
  /* Load the Inputs or process.env */
  const org = process.env.CI
    ? core.getInput("org", { required: false })
    : (process.env.ORG as string);
  const token = process.env.CI
    ? core.getInput("token", { required: false })
    : (process.env.API_TOKEN as string);
  const url = process.env.CI
    ? core.getInput("url", { required: false })
    : (process.env.BASE_URL as string);

  /* Setting the octokit client */
  const client = (await octokit(token, url)) as Octokit;

  /* Getting all our billing information */
  const data = (await billing(client, org)) as BillingAPIFunctionResponse;

  /* This tells us how many committers there are across all repos */
  const sum = data.repositories
    .map((element) => element.committers)
    .reduce((a, b) => a + b, 0) as number;

  /* Logging out some information  */
  console.log(`Total committers across repos: ${sum}`);
  console.log(
    `Total GHAS committers: ${data.total_advanced_security_committers}`
  );
  console.log(`Total repos with GHAS committers: ${data.repositories.length}`);

  /* This is the dataset that we think we are going to be able to clean GHAS up on */
  const reposWeThinkWeCanRemoveGHASOn = [];

  /* Let's run the repos through the criteria  */
  for (const repos of data.repositories) {
    /* Checking to see if any code scanning analaysis has been uploaded */
    const isCodeScanningBeingUsed = await checkCodeScanning(client, repos);
    isCodeScanningBeingUsed === false
      ? reposWeThinkWeCanRemoveGHASOn.push(repos)
      : null;
  }
  console.log(
    `Total repos that are not using code scanning: ${reposWeThinkWeCanRemoveGHASOn.length}`
  );
};

run();
