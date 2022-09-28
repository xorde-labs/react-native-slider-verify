module.exports = {
	preset: 'react-native',
	globals: {
		'ts-jest': {
			tsconfig: 'tests/tsconfig.json',
			isolatedModules: true,
		},
	},
	transform: {
		'^.+\\.jsx$': 'babel-jest',
		'^.+\\.tsx?$': 'ts-jest',
	},
	testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	cacheDirectory: '.jest/cache',
	testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
	transformIgnorePatterns: [],
};
