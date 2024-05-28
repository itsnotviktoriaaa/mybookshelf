module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'import-notation': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
};
