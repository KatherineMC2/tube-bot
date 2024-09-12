# Telegram Metro Alert Bot

This project is a Telegram bot designed to send real-time alerts about metro line disruptions. It will notify users instantly when there are issues on metro lines, helping them avoid delays and plan their trips more efficiently.

# ⚠️ Early Development Stage:
The project is still in its early stages and not functional yet, but updates and improvements are planned as development continues. Build in NodeJs , Typescript, AWS CDK and Github Actions



# tube-bot

Folder structure
- packages -> service-bot


## Pre Requisites
You need to install NodeJS with node 20. 
Check it with: 
```
node -v
```
## Installation
Go to service-bot folder and install the dependencies

To install the dependencies from the package.lock  use 
```
npm ci
```
## Scripts

```
npm run fix      /// Tries to lint it and format it
npm run lint     /// Checks linting
npm run cdk deploy  /// Deploy Cdk
```