import { Octokit } from "./octokitTypes";

import { ReposWithGHASAC } from "../../types/common";

export const checkCodeScanning = async (
  client: Octokit,
  repos: ReposWithGHASAC
) => {
  const [owner, repo] = repos.repo.split("/");
  let isCodeScanningBeingUsed = true;
  const { data } = await client.request(
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    {
      owner,
      repo,
      page: 1,
      per_page: 1,
    }
  );

  if (data === undefined || data.length == 0) {
    isCodeScanningBeingUsed = false;
  }

  return isCodeScanningBeingUsed;
};
