// @ts-check
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import babelParser from '@babel/eslint-parser';
import typegen from 'eslint-typegen';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const baseEslintConfig = [
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    name: 'vue',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        parser: {
          js: babelParser,
          ts: tsParser,
          '<template>': 'espree',
        },
      },
    },
  },
  {
    name: 'js',
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        parser: {
          js: babelParser,
          ts: tsParser,
        },
      },
    },
  },
];

export default [
  ...baseEslintConfig,
  {
    name: 'ignore',
    ignores: ['.nuxt'],
  },
];
