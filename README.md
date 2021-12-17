# GitHub Advanced Security Licence Cleanup

:construction: This project is still a work in progress :construction: 

## Introduction

A GitHub Action informing you of repositories you could disable GitHub Advanced Security to save some licences based on criteria. 

## Motivation

Most companies that adopt GitHub Advanced Security enable it across their organization at once (a big bang approach) and tick the option automatically enabling GitHub Advanced Security on all new repositories. This is great as it gives the most comprehensive coverage from a security perspective. However, this means that some repositories will take a licence and never actually use GitHub Advanced Security, especially the code scanning functionality. This leads to the potential of GitHub Advanced Security licences being consumed without actually using it. 

## Description

Taking the above into account, the purpose of this GitHub Action is to take a set of criteria into account and report to users which repositories can have GitHub Advanced Security disabled with the most negligible impact. For example, you wouldn't want to disable GitHub Advanced Security on a repository where maintainers use CodeQL daily. Or even third party SARIF tools. You would like to target the repositories that are not using the features available, so if GitHub Advanced Security is disabled, hopefully, the impact is minimal. 

## Technical Detail

The way this GitHub Action works is:

1. Firstly, collects all the repositories using GitHub Advanced Security. It uses the [Get GitHub Advanced Security active committers for an organization](https://docs.github.com/en/rest/reference/billing#get-github-advanced-security-active-committers-for-an-organization) API to collect this data. 
2. Secondly, we parse out any repositories that are not taking up GitHub Advanced Security committers. We do this because disabling GitHub Advanced Security on these repositories would not remove any GitHub Advanced Security licences from your pool. 
3. Thirdly, now we have a list of repositories using GitHub Advanced Security and consuming licences; we then run a set of criteria on these repositories to see out of that list, which repositories can have GitHub Advanced Security disabled, with the most negligible impact. 
4. Finally, the list is then uploaded to the workflow run as a JSON object for you to review. 

The criteria we ran can be found below for your review. Future work aims to give you the flexibility to weight criteria different, so you only remove GitHub Advanced Security on the repositories that you want to. Additionally, we would like to add a feature that loops through the JSON object and automatically disable GitHub Advanced Security after manually reviewing the list.

## Technical Limitations

There is one crucial aspect to know about the data that is returned: 

1. No guarantee disabling GitHub Advanced Security on the repositories in the list will save any seats. This action takes data available programmatically and gives you the best guess outcome. The way that GitHub Advanced Security billing works are by an active committer. If you disable GitHub Advanced Security on a repository where a user is committing to a different repository, disabling GitHub Advanced Security will not save any licences. Eventually, the aim is this GitHub Action will be clever enough to know which repositories you can confidently disable GitHub Advanced Security on and save licences. Still, for now, it is very much a best guess effort.

## Using this action 

See an example workflow below on how to run this GitHub Action.

```yaml
name: GitHub Advanced Security cleanup

on: [push]

jobs:
  ghas-cleanup:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup and run GHAS Licence Cleanup
        uses: nickliffen/ghas-licence@v1.0.0
        with:
          org: ${github_org}
          token: ${github_token}
          url: https://api.github.com
```

This GitHub Action takes in three inputs:

1. **org**: Which GitHub Organisation would you like to run this script on.
2. **token**: A GitHub PAT which has access to all repositories within the GitHub Organisation.
3. **URL**: The API URL. For GitHub.com, this would be `https://api.github.com`. For GitHub Server, it would be the API URL of your server instance. 

There would be only one output: if the job were successful or not. However, if you look at the workflow run, you will see a `repos.json` with repositories that could be disabled with minimal impact.

## Criteria 

Below, lists the criteria that we use (and will be using) to adjust which repositories can have GitHub Advanced Security disabled with minimal impact:

**Criteria 1**: List repositories that have GHAS enabled; but when hitting the [List code scanning analyses for a repository](https://docs.github.com/en/rest/reference/code-scanning#list-code-scanning-analyses-for-a-repository), it returns an empty array. This means no code scanning alerts have been uploaded. 

:construction: **Crirtia 2**: :construction: List repositories that have GHAS enabled; but when hitting the [List code scanning analyses for a repository](https://docs.github.com/en/rest/reference/code-scanning#list-code-scanning-analyses-for-a-repository), the last analysis was run over **180** days ago. This shows us that code scanning is inactive on this repository. 

We are looking to grow the list of criteria to be more practise and accurate. Expect to see this list grow.

## Contributing

For any questions/thoughts/contributions, please open an issue and let's chat!