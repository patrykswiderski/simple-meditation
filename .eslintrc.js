// https://docs.expo.dev/guides/using-eslint/

module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"expo",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		// Przykładowe reguły
		"react/prop-types": "off",
	},
};
