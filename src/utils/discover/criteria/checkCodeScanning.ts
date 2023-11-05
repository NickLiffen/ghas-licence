import { Octokit } from "../../general";
import * as core from "@actions/core";

import { ReposWithGHASAC } from "../../../../types/common/main";

export const checkCodeScanning = async (
  client: Octokit,
  repos: ReposWithGHASAC,
): Promise<boolean> => {
  try {
    const [owner, repo] = repos.repo.split("/");
    let isCodeScanningBeingUsed = true;
    const { data } = await client.request(
      "GET /repos/{owner}/{repo}/code-scanning/analyses",
      {
        owner,
        repo,
        page: 1,
        per_page: 1,
      },
    );

    if (data === undefined || data.length == 0) {
      isCodeScanningBeingUsed = false;
    }
    return isCodeScanningBeingUsed;
  } catch (e: any) {
    if (e.response.data.message === "no analysis found") {
      return false;
    } else {
      core.setFailed(
        `Something weird is going on with scanning repos for code scanning analysis: ${e}`,
      );
      throw e;
    }
  }
};
