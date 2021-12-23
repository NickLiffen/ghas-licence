import { ReposWithGHASAC } from "../../../types/common";

export const sum = (repo: ReposWithGHASAC[]) =>
  repo
    .map((element) => element.committers)
    .reduce((a, b) => a + b, 0) as number;
