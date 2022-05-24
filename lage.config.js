module.exports = {
  pipeline: {
    build: ['^build'],
    lint: ['build'],
    package: ['build'],
    test: ['build'],
  },
  npmClient: 'yarn',
};
