import * as core from "@actions/core";
import * as artifact from "@actions/artifact";

export const downloadArtefact = async (): Promise<void> => {
  const artifactClient = artifact.create();
  const downloadResponse = await artifactClient.downloadAllArtifacts();

  console.log(downloadResponse);
  console.log(downloadResponse.length);
  console.log(downloadResponse[0].artifactName);
  console.log(downloadResponse[0].downloadPath);
};
