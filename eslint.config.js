import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default {
  files: ['**/*.js', '**/*.jsx'],
  extends: [
    js.configs.recommended,
    'plugin:react/recommended',
    reactHooks.configs['recommended'],
    reactRefresh.configs.vite,
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
};
