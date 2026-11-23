// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['dist/**'] },

  eslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    extends: [tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser } }
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat.recommended
  },

  {
    files: ['*.js', 'mock-backend/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } }
  }
]);
