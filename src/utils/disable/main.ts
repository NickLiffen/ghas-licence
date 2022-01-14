import { ReposWithGHASAC } from "../../../types/common";
import { Octokit } from "../general";

export const run = async (
  client: Octokit,
  data: ReposWithGHASAC[]
): Promise<void> => {
  try {
    for await (const { repo } of data) {
      const [owner, repository] = repo.split("/");

      const requestParams = {
        owner,
        repo: repository,
        security_and_analysis: {
          advanced_security: {
            status: "disabled",
          },
          secret_scanning: {
            status: "disabled",
          },
        },
      };

      await client.request("PATCH /repos/{owner}/{repo}", requestParams);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
