import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Prettier: ESLintのフォーマット系ルールを無効化
  prettierConfig,

  // Phase 1: 基本コード品質ルール
  {
    rules: {
      // --- 未使用コードの検出 ---
      'no-unused-vars': 'off', // TypeScript版を使用
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // --- コード品質 ---
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // --- 安全性 ---
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },

  // CLIスクリプト: console.log を許可
  {
    files: ['prisma/seed.ts', 'scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
