// Hack to help with testing actions within this repo...
// For JS actions, the "main" will be interpreted relative to the repo root,
// not relative to the action.yaml. This file translates.
if (process.env.GITHUB_ACTION) {
  console.log(process.env.GITHUB_ACTION);
}
