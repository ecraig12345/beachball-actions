# beachball-actions

This monorepo contains GitHub Actions related to [Beachball](https://microsoft.github.io/beachball/).

(Thanks to https://github.com/int128/typescript-actions-monorepo for the TypeScript actions monorepo template!)

## Actions

| Name                             | Description                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| [batch-runs](batch-runs)         | Cancels this workflow run if any newer runs are pending for this branch (not specific to Beachball) |
| [should-release](should-release) | Determines whether a release workflow run is needed, and cancels it if not                          |

## Development

### Release workflow

When a pull request is merged into main branch, a new minor release is created by GitHub Actions.
See https://github.com/int128/release-typescript-action for details.
