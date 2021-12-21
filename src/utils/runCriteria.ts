import * as core from "@actions/core";
import { ReposWithGHASAC } from "../../types/common";
import { checkCodeScanning } from "./criteria";

import { Octokit } from "./octokitTypes";

export const runCriteria = async (
  dataToUse: ReposWithGHASAC[],
  client: Octokit
): Promise<ReposWithGHASAC[]> => {
  /* This is the dataset that we think we are going to be able to clean GHAS up on */
  const reposWeThinkWeCanRemoveGHASOn = [] as ReposWithGHASAC[];
  for (const repos of dataToUse) {
    /* Checking to see if any code scanning analaysis has been uploaded */
    try {
      const isCodeScanningBeingUsed = await checkCodeScanning(client, repos);
      isCodeScanningBeingUsed === false
        ? reposWeThinkWeCanRemoveGHASOn.push(repos)
        : null;
    } catch (e: any) {
      core.error("There was an error running the criteria. The error was:", e);
      core.setFailed("There was an error running the criteria");
      throw e;
    }
  }
  return reposWeThinkWeCanRemoveGHASOn;
};
