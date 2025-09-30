# React + Vite

This template provides a minimal setup to get React working in Vite with **Hot Module Replacement (HMR)** and some basic ESLint rules for JavaScript.

### Vite Plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses **Babel** for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses **SWC** for Fast Refresh.

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating your configuration to enable React-specific lint rules. Below is a basic ESLint setup for **React + JavaScript**.

### ESLint Configuration

Create or update the `.eslintrc.js` file with the following configuration:

```js
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
