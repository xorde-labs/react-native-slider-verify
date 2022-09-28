module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		['@babel/plugin-proposal-decorators', { version: 'legacy' }],
		'@babel/plugin-proposal-private-methods',
	],
};
