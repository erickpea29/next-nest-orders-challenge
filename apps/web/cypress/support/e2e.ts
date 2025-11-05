import "./commands";

import "cypress-mochawesome-reporter/register";

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

beforeEach(() => {});

afterEach(() => {});

Cypress.on("uncaught:exception", (err, runnable) => {
  if (err.message.includes("ResizeObserver")) {
    return false;
  }

  console.error("Uncaught exception:", err);

  return true;
});

Cypress.config("defaultCommandTimeout", 10000);
Cypress.config("requestTimeout", 10000);

declare global {
  namespace Cypress {
    interface Chainable {}
  }
}

export {};
