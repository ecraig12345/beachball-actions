# install-beachball

Globally installs the version of [Beachball](https://microsoft.github.io/beachball) specified in the repo root `package.json`'s `devDependencies`.

This is intended for running a change files check in a separate workflow where you don't need to do a full `yarn`/`npm install`.

## Getting started

To run this action:

```yaml
jobs:
  build:
    steps:
      # You must check out code before using this action
      - uses: actions/checkout@v3

      - uses: ecraig12345/beachball-actions/install-beachball@v2
```
