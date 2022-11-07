const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  const octokit = github.getOctokit(core.getInput('token'));
  const title = core.getInput('title');
  const body = core.getInput('body');
  const head = core.getInput('head');
  const base = core.getInput('base');
  const labels = core.getInput('labels').split(',');
  const reviewers = core.getInput('reviewers').split(',');

  const githubInfo = process.env.GITHUB_REPOSITORY?.split('/');
  const owner = githubInfo?.[0]
  const repo = githubInfo?.[1]
  try {
    const {
      data: { number: issueNumber },
    } = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      title,
      body,
      head,
      base,
    });
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
      owner,
      repo,
      issue_number: issueNumber,
      labels,
    });
    await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers', {
      owner,
      repo,
      pull_number: issueNumber,
      reviewers,
    });
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

main();