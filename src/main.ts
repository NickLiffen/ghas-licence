import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "../../.env" });

import { billing, octokit, checkCodeScanning } from "./utils";

import { Octokit } from "./utils/octokitTypes";

const run = async (): Promise<void> => {
  /* Setting the octokit client */
  const client = (await octokit()) as Octokit;

  /* Getting all our billing information */
  const data = await billing(client);

  /* This tells us how many committers there are across all repos */
  const sum = data.repositories
    .map((element) => element.committers)
    .reduce((a, b) => a + b, 0);

  console.log(`Total committers across repos: ${sum}`);
  console.log(
    `Total GHAS committers: ${data.total_advanced_security_committers}`
  );
  console.log(`Total repos with GHAS committers: ${data.repositories.length}`);

  data.repositories.forEach(async (element) => {
    const isCodeScanningBeingUsed = await checkCodeScanning(client, element);
    console.log(isCodeScanningBeingUsed);
  });
};

run();
