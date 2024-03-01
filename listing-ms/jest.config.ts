/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  moduleDirectories: ['<rootDir>/node_modules', '../'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest/globalSetup.ts',
  globalTeardown: '<rootDir>/jest/globalTeardown.ts',
  clearMocks: true,
};