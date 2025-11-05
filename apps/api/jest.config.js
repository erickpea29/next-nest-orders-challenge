module.exports = {
  displayName: "api",
  testEnvironment: "node",
  preset: "ts-jest",

  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        isolatedModules: true,
      },
    ],
  },

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",

  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!**/*.d.ts",
    "!**/*.interface.ts",
    "!**/*.module.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!**/*.config.{js,ts}",
    "!**/main.ts",
    "!**/data-source.ts",
    "!**/*.entity.ts",
    "!**/*.dto.ts",
  ],

  coverageDirectory: "../coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  setupFilesAfterEnv: ["<rootDir>/../test/setup.ts"],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  maxWorkers: "50%",

  verbose: true,
};
