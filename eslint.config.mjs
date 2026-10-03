import eslintConfigXo from 'eslint-config-xo'
import eslintConfigXoBrowser from 'eslint-config-xo/browser'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'js/dist/**',
      'node_modules/**',
      '_site/**',
      'coverage/**',
      'tests/golden/**',
      '**/*.min.js',
      '**/vendor/**',
      'js/coverage/**',
      '**/package-lock.json',
      'js/tests/**'
    ]
  },
  ...eslintConfigXo,
  // eslint-config-xo registers *.json as JSON after *.jsonc/tsconfig.json as
  // JSONC, which merges incompatible languageOptions. Restore JSONC for those.
  {
    files: ['**/*.jsonc', '**/tsconfig.json', '.vscode/*.json'],
    language: 'json/jsonc'
  },
  ...eslintConfigXoBrowser,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}'],
    ...eslintPluginImport.flatConfigs.errors
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}'],
    ...eslintPluginImport.flatConfigs.warnings
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}'],
    ...eslintPluginUnicorn.configs['flat/recommended']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}'],
    rules: {
      '@stylistic/arrow-body-style': 'off',
      'capitalized-comments': 'off',
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': [
        'error',
        2,
        {
          MemberExpression: 'off',
          SwitchCase: 1
        }
      ],
      'max-params': ['warn', 5],
      'new-cap': [
        'error',
        {
          properties: false
        }
      ],
      'no-console': 'error',
      'no-mixed-operators': 'off',
      '@stylistic/no-mixed-operators': 'off',
      '@stylistic/no-mixed-spaces-and-tabs': 'off',
      '@stylistic/indent-binary-ops': 'off',
      'no-negated-condition': 'off',
      '@stylistic/curly-newline': 'off',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'after'],
      '@stylistic/semi': ['error', 'never'],
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-unused-properties': 'error',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-array-find': 'off',
      'unicorn/prefer-array-flat': 'off',
      'unicorn/prefer-dom-node-append': 'off',
      'unicorn/prefer-dom-node-dataset': 'off',
      'unicorn/prefer-dom-node-remove': 'off',
      'unicorn/prefer-includes': 'off',
      'unicorn/prefer-math-trunc': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-optional-catch-binding': 'off',
      'unicorn/prefer-prototype-methods': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/prefer-reflect-apply': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prevent-abbreviations': 'off'
    },
    settings: {
      'import/core-modules': ['vitest/config', '@playwright/test']
    }
  },
  {
    files: ['.babelrc.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['build/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/prefer-top-level-await': 'off'
    }
  },
  {
    files: ['tests/e2e/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        bootstrap: 'readonly',
        sinon: 'readonly',
        Simulator: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-var': 'off',
      'no-useless-concat': 'off',
      'no-unused-vars': 'off',
      'object-shorthand': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-rest-params': 'off',
      'prefer-template': 'off',
      '@stylistic/curly-newline': 'off',
      '@stylistic/max-len': 'off',
      '@stylistic/object-curly-newline': 'off',
      '@stylistic/padding-line-between-statements': 'off',
      'import/no-named-as-default-member': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/no-unused-properties': 'off'
    }
  },
  {
    files: ['eslint.config.mjs', 'vitest.config.ts', 'playwright.config.ts'],
    rules: {
      'no-console': 'off'
    }
  }
]
