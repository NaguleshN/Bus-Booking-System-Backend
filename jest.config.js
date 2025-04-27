export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  testMatch: ["**/tests/**/*.test.js"],
  transform: {
    "^.+\\.js$": ["babel-jest", { presets: ["@babel/preset-env"] }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
 
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
