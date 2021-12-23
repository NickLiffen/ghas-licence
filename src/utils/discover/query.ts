import { Octokit, BillingType } from "../general";

import * as core from "@actions/core";

import {
  RequestParams,
  ReposWithGHASAC,
  BillingAPIFunctionResponse,
} from "../../../types/common";

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
    core.error("Error in making billing API Call", e);
    core.setFailed("Error in making billing API Call");
    throw e;
  }
};

export const billing = async (
  client: Octokit,
  githubOrg: string,
  p = 1 as number,
  reposWithGHASAC = [] as ReposWithGHASAC[],
  ac = 0 as number
): Promise<BillingAPIFunctionResponse> => {
  const requestParams = {
    org: githubOrg as string,
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
      return {
        repo: e.name,
        committers: e.advanced_security_committers,
        users: e.advanced_security_committers_breakdown,
      };
    });

    /* Storing the Array in a variable */
    structuredData.forEach((element) => {
      reposWithGHASAC.push(element);
    });
  }

  /* If there is data, let's check if there is anymore data in the next page */
  if (data.repositories.length > 0) {
    const pageNumber = p + 1;
    await billing(client, githubOrg, pageNumber, reposWithGHASAC, ac);
  }

  /* No more data available, this is it folks! */
  return {
    total_advanced_security_committers: ac,
    repositories: reposWithGHASAC,
  };
};
