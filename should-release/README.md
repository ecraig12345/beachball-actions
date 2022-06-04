# should-release

Determines whether a release workflow run is needed, and cancels it if not (unless `mode` is `output`). A run is needed if:

- [Beachball](https://microsoft.github.io/beachball) change files exist
- If `batch: true` is set, no newer runs for the same branch exist _(must also enable `concurrency` in workflow; see below)_

## Getting Started

To run this action:

```yaml
# This setting is required if `batch: true` is set (see below)
concurrency: ${{ github.ref }}

jobs:
  build:
    steps:
      # You must check out code before running this action
      - uses: actions/checkout@v3

      - uses: ecraig12345/beachball-actions/should-release@v1
        with:
          token: ${{ github.token }}
          batch: true
```

## Inputs

| Name          | Type                 | Required | Default         | Description                                                       |
| ------------- | -------------------- | -------- | --------------- | ----------------------------------------------------------------- |
| `token`       | string               | yes      |                 | GitHub token with `actions:write` permission                      |
| `mode`        | `cancel` \| `output` |          | `cancel`        | Whether to cancel the job or only output the result to a variable |
| `batch`       | boolean              |          | `false`         | Whether to emulate batched behavior (see below)                   |
| `change-glob` | string               |          | `change/*.json` | Glob to check for Beachball change files                          |

### `batch` option

If true, the action checks whether any newer builds are pending for the branch that triggered this build. (Batching is not supported for tags.)

For this option to work properly, it **MUST be combined with the built-in [`concurrency` option](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)** to ensure that only one build runs at a time for each branch. Add this (or some other string that's unique per branch) at the top of your workflow YAML:

```yaml
concurrency: ${{ github.ref }}
```

(This may seem redundant with `concurrency`'s `cancel-in-progress` option which cancels any in-progress runs when a new run is queued. However, that option is unsafe for release workflows with side effects: for example, if an old run gets canceled in the middle of `npm publish` or before it can push bumped versions back to git, things end up in an inconsistent state which usually requires manual intervention to fix.)

## Outputs

| Name           | Type          | Description                             |
| -------------- | ------------- | --------------------------------------- |
| `shouldCancel` | `yes` \| `no` | Whether the workflow should be canceled |
