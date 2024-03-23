module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']],
    'header-max-length': [2, 'always', 100],
    'header-case': [2, 'always', 'lower-case'],
    'body-leading-blank': [2, 'always'],
  }
};
