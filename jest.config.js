export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],

  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },

  extensionsToTreatAsEsm: [".ts"],
  transformIgnorePatterns: ["node_modules/"],

  globals: {
    "ts-jest": {
      useESM: true,
    },
  },

  injectGlobals: true,
};
