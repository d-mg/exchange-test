module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [`eslint:recommended`,],
    overrides: [],
    parserOptions: {
        ecmaVersion: `latest`,
        sourceType: `module`,
    },
    rules: {
        indent: [`error`, 4,],
        'eol-last': [`error`, `always`,],
        'no-multi-spaces': [`error`, { ignoreEOLComments: false, },],
        'no-multiple-empty-lines': [`error`, { max: 1, maxBOF: 2, maxEOF: 0, },],
        'padded-blocks': [`error`, `never`,],
        'space-in-parens': [`error`, `never`,],
        'object-curly-spacing': [`error`, `always`,],
        'array-bracket-spacing': [`error`, `never`,],
        semi: [`error`, `always`,],
        quotes: [`error`, `backtick`,],
        'comma-dangle': [`error`, {
            'arrays': `always`,
            'objects': `always`,
            'imports': `never`,
            'exports': `never`,
            'functions': `never`,
        },],
    },
};
