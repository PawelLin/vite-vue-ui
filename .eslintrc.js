module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 12,
    },
    rules: {},
}
