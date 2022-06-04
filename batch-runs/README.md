# batch-runs

Cancels this workflow run if any newer runs are pending for this branch (unless `mode` is `output`). This is meant to emulate the Azure DevOps `trigger: batch: true` option.

Runs against tags are not supported.

For this action to work properly, it **MUST be combined with the built-in [`concurrency` option](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)** to ensure that only one build runs at a time for each branch. Add this (or some other string that's unique per branch) at the top of your workflow YAML:

```yaml
concurrency: ${{ github.ref }}
```

(Despite the repo name, this particular action is not specific to [Beachball](https://microsoft.github.io/beachball).)

## Getting Started

To run this action:

```yaml
# This setting is required (the exact string can vary but must include the branch name)
concurrency: ${{ github.ref }}

jobs:
  build:
    steps:
      - uses: ecraig12345/beachball-actions/batch-runs@v1
        with:
          token: ${{ github.token }}
```

## Inputs

| Name    | Type                 | Required | Default  | Description                                                       |
| ------- | -------------------- | -------- | -------- | ----------------------------------------------------------------- |
| `token` | string               | yes      |          | GitHub token with `actions:write` permission                      |
| `mode`  | `cancel` \| `output` |          | `cancel` | Whether to cancel the job or only output the result to a variable |

## Notes

This action may seem redundant with `concurrency`'s `cancel-in-progress` option which cancels any in-progress runs when a new run is queued. However, that option is unsafe for workflows with side effects: for example, if a release workflow run gets canceled in the middle of `npm publish` or before it can push bumped versions back to git, things end up in an inconsistent state which usually requires manual intervention to fix.

## Outputs

| Name           | Type          | Description                             |
| -------------- | ------------- | --------------------------------------- |
| `shouldCancel` | `yes` \| `no` | Whether the workflow should be canceled |
