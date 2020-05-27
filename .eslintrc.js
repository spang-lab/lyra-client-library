module.exports = {
    parser: 'babel-eslint',
    extends: 'airbnb',
    plugins: [
        'react',
        'jsx-a11y',
        'import',
        'react-hooks',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'class-methods-use-this': 'off',
        'import/no-unresolved':'off',
        'import/extensions':'off',
        'import/no-extraneous-dependencies':'off',
        'import/prefer-default-export': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
};
