# Ure_screeps_AI_rollup

Ure_screeps_AI_rollup is an AI for screeps which is a game.

## Basic Usage

You will need:

- [Node.JS](https://nodejs.org/en/download) (10.x)
- A Package Manager ([Yarn](https://yarnpkg.com/en/docs/getting-started) or [npm](https://docs.npmjs.com/getting-started/installing-node))
- Rollup CLI (Optional, install via `npm install -g rollup`)

Download the latest source [here](https://github.com/screepers/screeps-typescript-starter/archive/master.zip) and extract it to a folder.

Open the folder in your terminal and run your package manager to install the required packages and TypeScript declaration files:

```bash
# npm
npm install

# yarn
yarn
```

if there is an error such as "can't find the package" when installing by npm install, try to switch the source of npm by using the npm command below:

```bash
npm i nrm -g
nrm ls
```
then the source list should be shown. you can choose another source by:
```bash
# name is any source name on the list above.
nrm use name
```
then the install command should work.

## Integration test with github action

It will run when you do a commit, and you could get some test data after the github action is done.

## Screeps-Profiler

An useful test tool called as Screeps-Profiler is used.
Some data files would being generated after finishing integration test. You can watch the callgrind graph by using the Qcachegrind/Kcachegrind and open these files in the software. The cpu statistical data are included.
