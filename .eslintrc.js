// https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules

module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    
    env: {
        'browser': true,
        'es6': true,
        'node': true,
        'jest': true
    },

    globals: {
        BABYLON: 'readonly',
        VERSION: 'readonly',
        SLACK_API: 'readonly'
    },
    ignorePatterns: ["bundle.js", "**/vendor/*.js"],
    rules: {
        semi: ['error', 'never'],

        indent: ['error', 4, {
            SwitchCase: 0
        }],

        'comma-dangle': ['error', 'never'],

        'max-len': ['warn', 120],

        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],

        complexity: ['warn', 10],

        'no-console': ['warn', {
            allow: ['warn', 'error']
        }],

        camelcase: ['error', {
            properties: 'always',
            ignoreDestructuring: false
        }],

        'prefer-destructuring': ['error', {
            VariableDeclarator: {
                array: false,
                object: false
            },
            AssignmentExpression: {
                array: false,
                object: false
            }
        },
        {
            enforceForRenamedProperties: false
        }],

        'no-unused-vars': ['error', {
            vars: 'all',
            args: 'none'
        }],

        'no-unused-expressions': ['error', {
            'allowTernary': true
        }],

        'class-methods-use-this': ['off'],
        'no-param-reassign': ['off'],
        'no-continue': ['off'],
        'no-bitwise': ['off'],
        'lines-between-class-members': ['off'],
        'import/no-unresolved': ['off'],
        'import/prefer-default-export': ['off'],
        'import/extensions': ['off'],
        '@typescript-eslint/no-var-requires': ['off']
    }

}