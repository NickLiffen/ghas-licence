import { Octokit } from "@octokit/core";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { RateLimitOptions } from "../../../types/common";

const MyOctokit = Octokit.plugin(paginateRest, retry, throttling);

export const octokit = async (
  token: string,
  baseUrl: string
): Promise<unknown> => {
  if (!token) {
    throw new Error(
      "No auth mechinsim. Please make sure you have a token OR app settings."
    );
  }
  const octokit = new MyOctokit({
    auth: token,
    previews: ["hellcat", "mercy", "machine-man"],
    request: { retries: 3 },
    baseUrl,
    throttle: {
      onRateLimit: (options: RateLimitOptions) => {
        return options.request.retryCount <= 3;
      },
      onAbuseLimit: () => {
        return true;
      },
    },
  });

  return octokit;
};
