import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
