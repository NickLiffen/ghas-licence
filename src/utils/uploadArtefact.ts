import * as core from "@actions/core";
import * as artifact from "@actions/artifact";

import { ReposWithGHASAC } from "../../types/common";

import { promises as fs } from "fs";

export const uploadArtefact = async (
  reposWeThinkWeCanRemoveGHASOn: ReposWithGHASAC[]
): Promise<void> => {
  const { GITHUB_REPOSITORY, GITHUB_WORKFLOW, GITHUB_RUN_NUMBER } = process.env;
  try {
    /* Let's write out the data to a file */
    const stringData = JSON.stringify(reposWeThinkWeCanRemoveGHASOn, null, 2);
    const fileName = `${GITHUB_REPOSITORY}/${GITHUB_WORKFLOW}/${GITHUB_RUN_NUMBER}/${+new Date()}repos.json`;
    await fs.writeFile("./data.json", stringData, "utf8");
    /* Upload Action to Workflow Run */
    const artifactClient = artifact.create();
    await artifactClient.uploadArtifact("./data.json", ["./data.json"], "./");
  } catch (e: any) {
    core.error(
      "There was an error writing file to disk or uploading to the workflow run artefact section. The error is:",
      e
    );
    core.setFailed(
      "There was an error writing file to disk or uploading to the workflow run artefact section"
    );
    throw e;
  }
};
