import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.browser, process: 'readonly' },
    },
  },
  { languageOptions: { globals: globals.browser, ...globals.jest } },
  pluginJs.configs.recommended,
];
