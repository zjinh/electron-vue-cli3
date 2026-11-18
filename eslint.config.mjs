import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'

export default [
  ...vue.configs['flat/essential'],
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  }
]
