import * as core from '@actions/core';
import * as github from '@actions/github';

export function getOctokit() {
  const token = core.getInput('token', { required: true });
  return github.getOctokit(token, { log: console });
}
