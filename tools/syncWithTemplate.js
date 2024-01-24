import { simpleGit } from "simple-git";

const TEMPLATE_REPO = "NuttyShrimp/svelte-kit-template";
// If we're ever diabolic enough to use something else, add it to the list
const MAIN_BRANCHES = ["main", "master"];

const git = simpleGit(process.cwd());

const existingRemotes = await git.getRemotes(true);
if (existingRemotes.length < 1) {
	throw new Error("This repo doesn't have any remotes configured");
}

if (existingRemotes.find((r) => r.name === "template")) {
	await git.removeRemote("template");
}

const viaSSH = existingRemotes[0].refs.fetch.startsWith("git@");
if (viaSSH) {
	await git.addRemote("template", `git@github.com:${TEMPLATE_REPO}.git`);
} else {
	await git.addRemote("template", `https://github.com/${TEMPLATE_REPO}.git`);
}

const repoStatus = await git.status();
if (!MAIN_BRANCHES.includes(repoStatus.current)) {
	throw new Error(`Current branch is ${repoStatus.current}, not one of ${MAIN_BRANCHES.join(", ")}`);
}
await git.fetch(repoStatus.current);

// Do not sync with pending changes
// if (repoStatus.files.length > 0) {
//   throw new Error("This repo has pending changes, please commit or stash them before syncing with the template");
// }

if (repoStatus.behind > 0) {
	throw new Error("This local repo is behind on the tracked repo");
}

await git.fetch("template", "master");

// await git.rebase(["template/master"]);
// console.log("Synced with template, cleaning up...");

const mergeResult = await git.merge(["template/master", "--allow-unrelated-histories"]);
if (mergeResult.failed) {
	console.error("Failed to merge changes from template, cleaning up...");
} else {
	console.log("Synced with template, cleaning up...");
}

await git.removeRemote("template");
