import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

import {
  billing,
  octokit,
  getUniqueDataSet,
  sum,
  log,
  getInputs,
  runCriteria,
  uploadArtefact,
} from "./utils";

import { BillingAPIFunctionResponse } from "../types/common";

import { Octokit } from "./utils/octokitTypes";

const run = async (): Promise<void> => {
  /* Load the Inputs or process.env */
  const [org, token, url, level] = await getInputs();

  /* Setting the octokit client */
  const client = (await octokit(token, url)) as Octokit;

  /* Getting all our billing information */
  const verboseBillingData = (await billing(
    client,
    org
  )) as BillingAPIFunctionResponse;

  /* Verbose Repos are all repos with a GHAS active committer on. May not be unique GHAS unique active mommitters. */
  const { repositories: verboseRepos } = verboseBillingData;

  /* Taking all the verbose dataset and parsing out the repos and their users which are unique */
  const preciseillingData = await getUniqueDataSet(verboseRepos);

  /* PrciseRepos Repos are all Repos a unique GHAS active committer on. */
  const { repositories: prciseRepos } = preciseillingData;

  /* This tells us how many unique committers there are across all repos */
  const uniqueSum = await sum(prciseRepos);

  /* Outputting data to logs */
  await log(org, verboseBillingData, preciseillingData, uniqueSum);

  /* This is the dataset we are going to use the identiy the repos to remove */
  const dataToUse = level === "verbose" ? verboseRepos : prciseRepos;

  /* This module coordinatates the criteria to be run to identify repos as good contenders to disable GHAS on */
  const reposWeThinkWeCanRemoveGHASOn = await runCriteria(dataToUse, client);

  /* If we run this in Github Action then upload the artefact */
  process.env.CI
    ? await uploadArtefact(reposWeThinkWeCanRemoveGHASOn, level)
    : null;
};

run();
