import * as core from "@actions/core";

import { BillingAPIFunctionResponse } from "../../../types/common";

export const log = async (
  org: string,
  verboseBillingData: BillingAPIFunctionResponse,
  preciseillingData: BillingAPIFunctionResponse,
  uniqueSum: number,
): Promise<void> => {
  core.info(
    `Firstly, across your: ${org} organization, there are ${verboseBillingData.total_advanced_security_committers} total GitHub advanced security committers. E.G this is how many seats you are consuming`,
  );

  core.info(
    `Digging into that ${verboseBillingData.total_advanced_security_committers} active committers (seats consumed) number. We found ${verboseBillingData.repositories.length} GitHub repositories where an active committer is present/seat is being consumed`,
  );

  core.info(
    `Furthermore, out of them ${verboseBillingData.repositories.length} GitHub repositories where an active committer is present. We found ${preciseillingData.repositories.length} GitHub repositories where there is one or greater unique active committer(s) present. E.G unique is defined as only taking up a GitHub Advanced Security seat on that one repository`,
  );

  core.info(
    `As mentioned in the README, repositories with unique active committers are better to target, as disabling GitHub advanced security on them repositories will clean up a licence straight away. They only commit to that one repository; they are not taking up a licence across multiple repositories where you need to disable GitHub advanced security on them all.`,
  );

  core.info(
    `Now, if you was to disable GitHub advanced security on all ${preciseillingData.repositories.length} repositories, you would be saving a total of ${uniqueSum} seats. (Note: ${uniqueSum} may be higher then ${preciseillingData.repositories.length}, because one repository may have more then one unique active committer on) `,
  );

  core.info(
    `Now, if you was to disable GitHub advanced security on all ${verboseBillingData.repositories.length} repositories, you would be saving a total of ${verboseBillingData.total_advanced_security_committers} seats. (This should not be possible though as you would be disabling GitHub advanced security on all repositories in your organisation) `,
  );

  core.info(
    `Now we have found all repositories consuming GitHub advanced security seats, as well as all repositories with unique committers, let us go ahead and run some checks to see which repositories are the most likely inactive.`,
  );
};
