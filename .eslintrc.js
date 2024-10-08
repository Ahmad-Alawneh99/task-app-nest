module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: [
		"@stylistic/js",
		"@typescript-eslint"
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		"eqeqeq": "error",
		"no-await-in-loop": "error",
		"consistent-return": "error",
		"curly": "error",
		"prefer-template": "error",
		"no-var": "error",
		"no-use-before-define": "error",
		"@stylistic/js/semi": "error",
		"@stylistic/js/quotes": ["error", "single"],
		"@stylistic/js/arrow-spacing": "error",
		"@stylistic/js/no-multi-spaces": "error",
		"@stylistic/js/eol-last": "error",
		"@stylistic/js/comma-spacing": "error",
		"@stylistic/js/comma-dangle": ["error", "always-multiline"],
		"@stylistic/js/indent": ["error", "tab"],
		"@stylistic/js/no-trailing-spaces": "error",
		"@stylistic/js/padding-line-between-statements": ["error",
			{ "blankLine": "always", "prev": "*", "next": "return" }
		],
		"@stylistic/js/no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
		"@stylistic/js/object-curly-spacing": ["error", "always"],
		"@stylistic/js/keyword-spacing": ["error", { "before": true, "after": true }],
		"@stylistic/js/block-spacing": "error",
		"@stylistic/js/space-infix-ops": ["error"],
		"@typescript-eslint/no-non-null-assertion": ["error"],
		"@typescript-eslint/prefer-optional-chain": "error",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/require-await": ["error"],
		"@typescript-eslint/no-floating-promises": "error"
	},
};
