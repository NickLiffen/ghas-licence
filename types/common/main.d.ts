export type RateLimitOptions = {
  request: {
    retryCount: number;
  };
};

export type RequestParams = {
  org: string;
  per_page: number;
  page: number;
};

export type ReposWithGHASAC = {
  repo: string;
  committers: number;
};

export type BillingAPIFunctionResponse = {
  total_advanced_security_committers: number;
  repositories: ReposWithGHASAC[];
};
