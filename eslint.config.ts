import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default [
  ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
  ),
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: { ts: '@typescript-eslint/parser' },
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: { vue },
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
    },
  },
]
