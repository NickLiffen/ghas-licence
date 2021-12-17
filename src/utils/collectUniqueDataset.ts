import {
  BillingAPIFunctionResponse,
  ReposWithGHASAC,
  ArrayOfUsersToRepos,
} from "../../types/common";

export const getUniqueDataSet = async (
  repositories: ReposWithGHASAC[]
): Promise<BillingAPIFunctionResponse> => {
  const usersToRepos: ArrayOfUsersToRepos = [];

  /*Looping through and finding all unique users. Unique users are defined as users who only commit
  to a single GitHub Repository.*/
  for (const repos of repositories) {
    const { users } = repos;
    for (const user of users) {
      const { user_login } = user;
      const userToRepo = {
        user: user_login,
        repos: [],
      };
      if (
        !usersToRepos.find((e) => e.user === user_login && e.repos.length > 0)
      ) {
        usersToRepos.push(userToRepo);
      }

      const userIndex = usersToRepos.findIndex((e) => e.user === user_login);

      usersToRepos[userIndex].repos.push(repos.repo);
    }
  }

  /* Loop through the usersToRepos array, find which users are only in one repo, add them to the uniqueRepos array. */
  const uniqueRepos: string[] = [];
  for (const userToRepo of usersToRepos) {
    if (userToRepo.repos.length === 1) {
      uniqueRepos.push(userToRepo.repos[0]);
    }
  }

  /* Loop through the usersToRepos array, remove any element where the element's repos array is equal to one */
  const usersToReposFiltered = usersToRepos.filter((e) => e.repos.length === 1);

  const unique: BillingAPIFunctionResponse = {
    total_advanced_security_committers: uniqueRepos.length,
    repositories: [],
  };

  /* Loop through the usersToReposFiltered array, count the number of users in each repo, and add it to the unique object */
  for (const userToRepo of usersToReposFiltered) {
    const { user, repos } = userToRepo;
    const repo = repos[0];
    const index = unique.repositories.findIndex((e) => e.repo === repo);
    if (index === -1) {
      unique.repositories.push({
        repo,
        committers: 1,
        users: [
          {
            user_login: user,
          },
        ],
      });
    } else {
      unique.repositories[index].committers += 1;
      unique.repositories[index].users.push({
        user_login: user,
      });
    }
  }

  return unique;
};
