# GitHub Actions Boilerplate

## Introduction

A sample GitHub action boilerplate for Typescript actions. 

It comes with:
- **Node 16 Support**: Current LTS. 
- **ESlint and Prettier**: Code quality and consistency tooling. 
- **Husky**: Pre-commit hook ensuring code is built before being deployed to GitHub. 

There are many open source actions boilerplates/templates. I use this one as I try and keep it up to date and simplistic. 

## Getting Started

Click [Use this template](https://github.com/NickLiffen/actions-boilerplate/generate) on this repository. Enter in your action repository name and description, and click *Create repository from template*. 

Close down locally, and run:

```
yarn install --frozen-lockfile && yarn run build
```

Edit the required fields within the `package.json` and `action.yml` and you should be good to go. Simply start writing code within the `src` directory. 

## Contrubting?

Simply raise a pull request :) Make sure CI passes and then you should be good to go.

