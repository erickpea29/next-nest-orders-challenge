Cypress.Commands.add("visitHomePage", () => {
  cy.visit("/");
  cy.wait(500);
});

Cypress.Commands.add(
  "interceptOrdersAPI",
  (fixture?: string, statusCode: number = 200) => {
    if (fixture) {
      cy.intercept("GET", "**/orders", {
        statusCode,
        fixture,
      }).as("getOrders");
    } else {
      cy.intercept("GET", "**/orders").as("getOrders");
    }
  }
);

Cypress.Commands.add(
  "interceptCreateOrderAPI",
  (statusCode: number = 201, response?: any) => {
    const defaultResponse = {
      statusCode,
      body: response || {
        data: {
          id: "test-order-id",
          item: "Test Item",
          price: 100,
          status: "NEW",
          createdAt: new Date().toISOString(),
        },
      },
    };

    cy.intercept("POST", "**/orders", defaultResponse).as("createOrder");
  }
);

Cypress.Commands.add(
  "interceptUpdateOrderAPI",
  (orderId?: string, statusCode: number = 200) => {
    const url = orderId ? `**/orders/${orderId}` : "**/orders/*";
    cy.intercept("PATCH", url, {
      statusCode,
      body: {
        data: {
          id: orderId || "test-id",
          status: "PAID",
          updatedAt: new Date().toISOString(),
        },
      },
    }).as("updateOrder");
  }
);

Cypress.Commands.add(
  "interceptDeleteOrderAPI",
  (orderId?: string, statusCode: number = 200) => {
    const url = orderId ? `**/orders/${orderId}` : "**/orders/*";
    cy.intercept("DELETE", url, {
      statusCode,
    }).as("deleteOrder");
  }
);

Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("not.contain", "Loading orders...");
});

Cypress.Commands.add("openCreateOrderDrawer", () => {
  cy.contains("button", "Create New Order").click();
  cy.contains("Create New Order").should("be.visible");
  cy.wait(300);
});

Cypress.Commands.add("fillOrderForm", (item: string, price: string) => {
  cy.contains("Create New Order").should("be.visible");

  if (item) {
    cy.get(
      'input[placeholder*="item" i], input[name="item"], input[type="text"]'
    )
      .first()
      .should("be.visible")
      .clear({ force: true })
      .type(item);
  }

  if (price) {
    cy.get(
      'input[type="number"], input[placeholder*="price" i], input[name="price"]'
    )
      .first()
      .should("be.visible")
      .clear({ force: true })
      .type(price);
  }
});

Cypress.Commands.add("submitOrderForm", () => {
  cy.contains("button", "Save Order").click();
});

Cypress.Commands.add(
  "verifyToast",
  (message: string, type: "success" | "error" = "success") => {
    cy.contains(message, { timeout: 10000 }).should("be.visible");
  }
);

Cypress.Commands.add("verifyTableContains", (text: string) => {
  cy.get("table").should("contain", text);
});

Cypress.Commands.add("getOrderRow", (itemName: string) => {
  return cy.contains("tr", itemName);
});

Cypress.Commands.add(
  "verifyOrderStatus",
  (itemName: string, status: string) => {
    cy.getOrderRow(itemName).within(() => {
      cy.contains(status).should("be.visible");
    });
  }
);

Cypress.Commands.add("openOrderActions", (itemName: string) => {
  cy.getOrderRow(itemName).within(() => {
    cy.get("button").filter(":visible").last().click({ force: true });
  });
  cy.wait(500);
});

declare global {
  namespace Cypress {
    interface Chainable {
      visitHomePage(): Chainable<void>;
      interceptOrdersAPI(
        fixture?: string,
        statusCode?: number
      ): Chainable<void>;
      interceptCreateOrderAPI(
        statusCode?: number,
        response?: any
      ): Chainable<void>;
      interceptUpdateOrderAPI(
        orderId?: string,
        statusCode?: number
      ): Chainable<void>;
      interceptDeleteOrderAPI(
        orderId?: string,
        statusCode?: number
      ): Chainable<void>;
      waitForPageLoad(): Chainable<void>;
      openCreateOrderDrawer(): Chainable<void>;
      fillOrderForm(item: string, price: string): Chainable<void>;
      submitOrderForm(): Chainable<void>;
      verifyToast(message: string, type?: "success" | "error"): Chainable<void>;
      verifyTableContains(text: string): Chainable<void>;
      getOrderRow(itemName: string): Chainable<JQuery<HTMLTableRowElement>>;
      verifyOrderStatus(itemName: string, status: string): Chainable<void>;
      openOrderActions(itemName: string): Chainable<void>;
    }
  }
}

export {};
