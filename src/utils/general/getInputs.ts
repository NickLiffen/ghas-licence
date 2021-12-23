import * as core from "@actions/core";

export const getInputs = async (): Promise<string[]> => {
  const org: string = process.env.CI
    ? core.getInput("org", { required: false })
    : (process.env.ORG as string);
  const token: string = process.env.CI
    ? core.getInput("token", { required: false })
    : (process.env.API_TOKEN as string);
  const url: string = process.env.CI
    ? core.getInput("url", { required: false })
    : (process.env.BASE_URL as string);
  const level: string = process.env.CI
    ? core.getInput("level", { required: false })
    : (process.env.LEVEL as string);
  const action: string = process.env.CI
    ? core.getInput("action", { required: false })
    : (process.env.ACTION as string);

  return [org, token, url, level, action];
};
