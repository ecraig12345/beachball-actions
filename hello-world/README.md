# hello-world

This is a template of TypeScript Action.

## Getting Started

To run this action:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ecraig12345/beachball-actions/hello-world@v1
        with:
          name: hello
```

## Inputs

| Name   | Required | Default | Description   |
| ------ | -------- | ------- | ------------- |
| `name` | `true`   | -       | example input |

## Outputs

| Name      | Description    |
| --------- | -------------- |
| `example` | example output |
