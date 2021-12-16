import { Octokit, BillingType } from "./octokitTypes";

import {
  RequestParams,
  ReposWithGHASAC,
  BillingAPIFunctionResponse,
} from "../../types/common";

const query = async (
  requestParams: RequestParams,
  client: Octokit
): Promise<object> => {
  try {
    return await client.request(
      "GET /orgs/{org}/settings/billing/advanced-security",
      requestParams
    );
  } catch (e: any) {
    console.log("Error in making billing API Call");
    throw new Error(e);
  }
};

export const billing = async (
  client: Octokit,
  p = 1 as number,
  reposWithGHASAC = [] as ReposWithGHASAC[],
  ac = 0 as number
): Promise<BillingAPIFunctionResponse> => {
  const requestParams = {
    org: process.env.ORG as string,
    per_page: 100 as number,
    page: p as number,
  };

  /* Making the API Call */
  const { data } = (await query(requestParams, client)) as BillingType;

  /* Storing the total number of active committers AC*/
  if (p === 1 && data.total_advanced_security_committers) {
    ac = data.total_advanced_security_committers;
  }

  /* Seeing if there is data. If there is, let us parse it */
  if (data.repositories) {
    /* Filtering out any repository that has 0 AC*/
    const postiveAC = data.repositories.filter(
      (repo) => repo.advanced_security_committers > 0
    );

    /* Building the Array that I would like stored*/
    const structuredData = postiveAC.map((e) => {
      return { repo: e.name, committers: e.advanced_security_committers };
    });

    /* Storing the Array in a variable */
    structuredData.forEach((element) => {
      reposWithGHASAC.push(element);
    });
  }

  if (data.repositories.length > 0) {
    const pageNumber = p + 1;
    await billing(client, pageNumber, reposWithGHASAC, ac);
  }

  return {
    total_advanced_security_committers: ac,
    repositories: reposWithGHASAC,
  };
};
