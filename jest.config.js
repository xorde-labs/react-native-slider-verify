module.exports = {
	preset: 'react-native',
	transform: {
		'^.+\\.jsx$': 'babel-jest',
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tests/tsconfig.json',
			},
		],
	},
	testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
