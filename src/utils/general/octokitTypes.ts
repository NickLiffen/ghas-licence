import { RequestInterface } from "@octokit/types";
import { PaginateInterface } from "@octokit/plugin-paginate-rest";

export interface Octokit {
  paginate: PaginateInterface;
  request: RequestInterface;
}

type advanced_security_committers_breakdown = {
  user_login: string;
  last_pushed_date: string;
};

type repositories = {
  name: string;
  advanced_security_committers: number;
  advanced_security_committers_breakdown: advanced_security_committers_breakdown[];
};

type BillingOptions = {
  total_advanced_security_committers: number;
  repositories: repositories[];
};

export type BillingType = {
  data: BillingOptions;
  status: 200;
};
