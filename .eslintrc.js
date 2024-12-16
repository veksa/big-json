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
            'indent': 'off',
            '@stylistic/indent': [
                'error', 4,
            ],
            'comma-dangle': 'off',
        }
    },
);
