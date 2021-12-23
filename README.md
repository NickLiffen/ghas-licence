# GitHub Advanced Security Licence Cleanup

## Introduction

This GitHub Action informs you of repositories you could disable GitHub Advanced Security on to save some licences based on criteria. 

## Motivation

Most companies that adopt GitHub Advanced Security enable it across their organization all at once (a big bang approach) and tick the option automatically enabling GitHub Advanced Security on all new repositories. This is great as it gives the most comprehensive coverage from a security perspective. However, this means that some repositories will take a licence and never actually use GitHub Advanced Security, especially the code scanning functionality (e.g., lack of language support on the repository). This leads to the potential of GitHub Advanced Security licences being consumed without actually using it. This is called: "wasting a licence". 

## Description

Taking the above into account, the purpose of this GitHub Action is to take a set of criteria into account and report to users which repositories can have GitHub Advanced Security disabled with the most negligible impact. For example, you wouldn't want to disable GitHub Advanced Security on a repository where maintainers use CodeQL daily. Or even third party SARIF tools. You would like to target the repositories that are not using the features available, so if GitHub Advanced Security is disabled, hopefully, the impact is minimal. 

## How this action works

We collect all repositories consuming a GitHub Advanced Security licence using the [Get GitHub Advanced Security active committers for an organization](https://docs.github.com/en/rest/reference/billing#get-github-advanced-security-active-committers-for-an-organization) API endpoint. 
 
What happens next depends on how broad/precise you would like to be. 

- **verbose**: Verbose data contains repositories with greater than 0 active committers. E.G. repositories that consume a GitHub Advanced Security licence. 
- **precise**: Precise data contains repositories with greater than 0 unique active committers. A unique active committer only commits to one repository. Meaning disabling GitHub Advanced Security on these repositories will straight away free up licences; based on how many unique active committers are on the repositories. 

The _problem_ with verbose data is disabling GitHub Advanced Security on these repositories _may not_ save you any GitHub Advanced Security licences. 

Let's walk through a few example use cases explaining this: 

- Verbose data is collected (one hundred repositories). We then run a set of criteria that scope down the repositories where GitHub Advanced Security can be disabled (ten repositories). GitHub Advanced Security is then disabled on ten repositories, but only one licence is saved. The reason is, most of the committees on these ten repositories also commit to other repositories outside of these ten. Meaning that disabling GitHub Advanced Security didn't save many licences, as committers are still committing on other repositories. 
- Precise data is collected (thirty repositories). We then run a set of criteria that scope down the repositories where GitHub Advanced Security can be disabled (eight repositories). GitHub Advanced Security is then disabled on eight repositories, and we save ten licences. Ten licences were saved because on seven repositories, there was one unique active committer, but on one, there were three unique active committers. These committers were only committing to these repositories; that's why all the licences were saved. 

The default for this GitHub Action is always going to be precise data. The reason is its accuracy. However, there is a potential to save more licences with the verbose data option because the criteria is run on a broader set of repositories. The number of licences that this action could save is just a little more unknown. You can pick either verbose or precise. 

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

      # Running the discover action on the org my-org using token token-123, only collecting precise data.
      - name: Setup and run GHAS Licence Cleanup
        uses: nickliffen/ghas-licence@v1.0.0
        with:
          org: my-org
          token: token-123

      # Running the discover action on the org my-org using token token-123, on the enterprise server URL https://enterprise-server/api/v3, collecting verbose data.
      - name: Setup and run GHAS Licence Cleanup
        uses: nickliffen/ghas-licence@v1.0.0
        with:
          org: my-org
          token: token-123
          URL: https://enterprise-server/api/v3
          level: verbose
```

## Inputs

This GitHub Action takes the following inputs:

| Input Name | Required | Valid Options     | Default Value          | Description                                    |
|------------|----------|-------------------|------------------------|------------------------------------------------|
| action     | false    | discover\|disable | discover               | See README.md for more details                 |
| org        | true     | any               | none                   | The GitHub Org to run the script on            |
| token      | true     | any               | none                   | The GitHub PAT which has all repo scope access |
| URL        | true     | any               | https://api.github.com | The API URL                                    |
| level      | false    | verbose\|precise  | precise                | See README.md for more details                 |

Please note, right now, only discover works. Work is underway to add the disablement feature. 

## Outputs

This GitHub Action outputs the following:

| Output Name | Required | Valid Options | Default Value | Description |
|-------------|----------|---------------|---------------|-------------|
| success     | n/a      | n/a           | n/a           | true\|false |

## Criteria 

Below, lists the criteria that we use to determine which repositories can have GitHub Advanced Security disabled with minimal impact. These criteria are run during the `discover` action:

**Criteria 1**: List repositories that have GHAS enabled; but when hitting the [List code scanning analyses for a repository](https://docs.github.com/en/rest/reference/code-scanning#list-code-scanning-analyses-for-a-repository), it returns an empty array. This means no code scanning alerts have been uploaded; ever.

:construction: **Crirtia 2**: :construction: List repositories that have GHAS enabled; but when hitting the [List code scanning analyses for a repository](https://docs.github.com/en/rest/reference/code-scanning#list-code-scanning-analyses-for-a-repository), the last analysis was run over **180** days ago. This shows us that code scanning is inactive on this repository. 

:construction: **Crirtia 3**: :construction: List repositories that have GHAS enabled; but when hitting the [List secret scanning alerts for a repository](https://docs.github.com/en/rest/reference/secret-scanning#list-secret-scanning-alerts-for-a-repository), there are no secrets returned. This means that there are currently no leaked secrets on that repository.

Right now, only Criteria 1 is in effect.

## Contributing

For any questions/thoughts/contributions, please open an issue and let's chat!