import * as core from "@actions/core";
import * as artifact from "@actions/artifact";

import { ReposWithGHASAC } from "../../types/common";

import { promises as fs } from "fs";

export const uploadArtefact = async (
  reposWeThinkWeCanRemoveGHASOn: ReposWithGHASAC[]
): Promise<void> => {
  const { GITHUB_WORKFLOW, GITHUB_WORKSPACE } = process.env;
  try {
    /* Let's write out the data to a file */
    const workflowName = (GITHUB_WORKFLOW as string)
      .replace(/\s+/g, "-")
      .toLowerCase() as string;
    const stringData = JSON.stringify(reposWeThinkWeCanRemoveGHASOn, null, 2);
    const fileName = `${GITHUB_WORKSPACE}/${workflowName}-${+new Date()}-repos.json`;
    console.log(`fileName`, fileName);
    console.log("__dirname", __dirname);
    await fs.readdir(__dirname);
    const result = await fs.writeFile(fileName, stringData, "utf8");
    await fs.readdir(__dirname);
    console.log("create file result", result);
    /* Upload Action to Workflow Run */
    const artifactClient = artifact.create();
    await artifactClient.uploadArtifact(
      `${+new Date()}-repos.json`,
      [`${GITHUB_WORKSPACE}/${workflowName}-${+new Date()}-repos.json`],
      `${GITHUB_WORKSPACE}`
    );
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
