module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', '@vue/typescript', '@vue/prettier', '@vue/prettier/@typescript-eslint'],
	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		'no-duplicate-case': 2,
		eqeqeq: [2, 'allow-null'],
		'eol-last': ['error', 'always'],
		'@typescript-eslint/no-var-requires': 0,
	},
	parserOptions: {
		parser: '@typescript-eslint/parser',
	},
};
