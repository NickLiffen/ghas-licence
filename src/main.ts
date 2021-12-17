import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import * as core from "@actions/core";
import * as artifact from "@actions/artifact";

import { promises as fs } from "fs";

import { billing, octokit, checkCodeScanning } from "./utils";

import {
  BillingAPIFunctionResponse,
  ArrayOfUsersToRepos,
} from "../types/common";

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

  const { repositories } = data;

  const usersToRepos: ArrayOfUsersToRepos = [];

  for (const repos of repositories) {
    const { users } = repos;
    for (const user of users) {
      const { user_login } = user;
      const userToRepo = {
        user: user_login,
        repos: [],
      };
      if (
        !usersToRepos.find((e) => e.user === user_login && e.repos.length > 0)
      ) {
        usersToRepos.push(userToRepo);
      }

      const userIndex = usersToRepos.findIndex((e) => e.user === user_login);

      usersToRepos[userIndex].repos.push(repos.repo);
    }
  }

  /* Loop through the usersToRepos array, find which users are only in one repo, add them to the uniqueRepos array. */
  const uniqueRepos: string[] = [];
  for (const userToRepo of usersToRepos) {
    if (userToRepo.repos.length === 1) {
      uniqueRepos.push(userToRepo.repos[0]);
    }
  }

  console.log(`There are ${uniqueRepos.length} repos with unique committers`);

  /* Loop through the usersToRepos array, remove any element where the element's repos array is equal to one */
  const usersToReposFiltered = usersToRepos.filter((e) => e.repos.length === 1);

  const unique: BillingAPIFunctionResponse = {
    total_advanced_security_committers: uniqueRepos.length,
    repositories: [],
  };

  /* Loop through the usersToReposFiltered array, count the number of users in each repo, and add it to the unique object */
  for (const userToRepo of usersToReposFiltered) {
    const { user, repos } = userToRepo;
    const repo = repos[0];
    const index = unique.repositories.findIndex((e) => e.repo === repo);
    if (index === -1) {
      unique.repositories.push({
        repo,
        committers: 1,
        users: [
          {
            user_login: user,
          },
        ],
      });
    } else {
      unique.repositories[index].committers += 1;
      unique.repositories[index].users.push({
        user_login: user,
      });
    }
  }

  console.log(unique);

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
    try {
      const isCodeScanningBeingUsed = await checkCodeScanning(client, repos);
      isCodeScanningBeingUsed === false
        ? reposWeThinkWeCanRemoveGHASOn.push(repos)
        : null;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to run criteris on repos");
    }
  }
  console.log(
    `Total repos that are not using code scanning: ${reposWeThinkWeCanRemoveGHASOn.length}`
  );

  if (process.env.CI) {
    try {
      /* Let's write out the data to a file */
      const stringData = JSON.stringify(reposWeThinkWeCanRemoveGHASOn, null, 2);
      await fs.writeFile("./data.json", stringData, "utf8");
      /* Upload Action to Workflow Run */
      const artifactClient = artifact.create();
      await artifactClient.uploadArtifact("./data.json", ["./data.json"], "./");
    } catch (e) {
      console.log(e);
      throw new Error("Failed to upload artifact");
    }
  }
};

run();
