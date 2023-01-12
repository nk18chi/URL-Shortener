/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
