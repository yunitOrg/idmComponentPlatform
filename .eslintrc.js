module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true
    },
    extends: ['plugin:vue/base', 'plugin:vue/vue3-essential', 'plugin:vue/vue3-strongly-recommended', 'plugin:vue/vue3-recommended', 'eslint:recommended', 'standard'],
    overrides: [],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        indent: [2, 4, { SwitchCase: 1 }],
        'space-before-function-paren': 0,
        'vue/multi-word-component-names': 0,
        'vue/max-attributes-per-line': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/html-self-closing': 0,
        'vue/html-indent': [2, 4],
        'vue/html-closing-bracket-newline': 0,
        'vue/attribute-hyphenation': 0,
        'vue/v-on-event-hyphenation': 0,
        'no-undef': 0,
        'no-debugger': 0,
        'no-useless-escape': 0,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'prefer-promise-reject-errors': 0,
        'no-async-promise-executor': 0
    }
}
