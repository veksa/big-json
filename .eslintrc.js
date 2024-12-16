import {FlatCompat} from '@eslint/eslintrc';
import eslint from '@eslint/js';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import regexpPlugin from 'eslint-plugin-regexp';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default tseslint.config(
    eslint.configs.recommended,
    ...compat.extends('airbnb'),
    // ...compat.extends('airbnb-typescript'),
    ...tseslint.configs.recommendedTypeChecked,
    stylistic.configs['recommended-flat'],
    regexpPlugin.configs['flat/recommended'],
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
            unicorn,
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'semi': 'off',
            'indent': 'off',
            'comma-dangle': 'off',
            'linebreak-style': 'off',
            'object-curly-spacing': 'off',
            'arrow-parens': 'off',
            'import/no-unresolved': 'off',
            'import/prefer-default-export': 'off',
            'arrow-body-style': 'off',
            'no-restricted-syntax': 'off',
            '@stylistic/indent-binary-ops': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@stylistic/indent': [
                'error', 4,
            ],
            '@stylistic/brace-style': [
                'error', '1tbs',
            ],
            '@stylistic/semi': [
                'error', 'always',
            ],
            'import/extensions': 'off',
            '@stylistic/object-curly-spacing': [
                'error', 'never',
            ],
            '@stylistic/arrow-parens': [
                'error', 'as-needed',
            ],
            'max-len': [
                'error', {
                    'code': 140,
                    'tabWidth': 4,
                    'ignoreComments': true,
                    'ignoreStrings': true,
                    'ignoreTemplateLiterals': true,
                    'ignoreRegExpLiterals': true,
                    'ignorePattern': '^import \\{\\(.*?\\)\\}'
                }
            ],
            '@stylistic/member-delimiter-style': [
                'error', {
                    'multiline': {
                        'delimiter': 'semi',
                        'requireLast': true
                    },
                    'singleline': {
                        'delimiter': 'semi',
                        'requireLast': false
                    }
                }
            ],
        }
    },
);
