import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "../../.env" });

import { billing, octokit, checkCodeScanning } from "./utils";

import { BillingAPIFunctionResponse } from "../types/common";

import { Octokit } from "./utils/octokitTypes";

const run = async (): Promise<void> => {
  /* Setting the octokit client */
  const client = (await octokit()) as Octokit;

  /* Getting all our billing information */
  const data = (await billing(client)) as BillingAPIFunctionResponse;

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

  const reposWeThinkWeCanRemoveGHASOn = [];

  /* Let's run the repos through the criteria  */
  data.repositories.forEach(async (element) => {
    const isCodeScanningBeingUsed = await checkCodeScanning(client, element);
    isCodeScanningBeingUsed === false
      ? reposWeThinkWeCanRemoveGHASOn.push(element)
      : null;
  });

  console.log(reposWeThinkWeCanRemoveGHASOn.length);
};

run();
