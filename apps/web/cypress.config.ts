import { defineConfig } from "cypress";
import cypressMochawesomeReporter from "cypress-mochawesome-reporter/plugin";

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: "Cypress E2E Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",

    viewportWidth: 1280,
    viewportHeight: 720,

    video: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    videoCompression: 32,

    retries: {
      runMode: 2,
      openMode: 0,
    },

    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    supportFile: "cypress/support/e2e.ts",

    setupNodeEvents(on, config) {
      cypressMochawesomeReporter(on);

      return config;
    },

    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    },

    excludeSpecPattern: [
      "**/examples/*",
      "**/1-getting-started/*",
      "**/2-advanced-examples/*",
    ],
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },
});
