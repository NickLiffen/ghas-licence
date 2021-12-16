import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "../../.env" });

import { billing, octokit } from "./utils";

import { Octokit } from "./utils/octokitTypes";

const run = async (): Promise<void> => {
  const client = (await octokit()) as Octokit;

  const data = await billing(client);
  const sum = data.repositories
    .map((element) => element.committers)
    .reduce((a, b) => a + b, 0);
  console.log(`Total committers across repos: ${sum}`);
  console.log(
    `Total GHAS committers: ${data.total_advanced_security_committers}`
  );
};

run();
