export default {
    testEnvironment: 'node', // Use Node.js environment
    transform: {
      '^.+\\.js$': 'babel-jest', // Use Babel to transpile JavaScript files
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/tests/**/*.test.js'], // Look for test files in the `tests` directory
  };