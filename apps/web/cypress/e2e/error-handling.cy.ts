describe("Error Handling", () => {
  describe("Orders List API Errors", () => {
    it("should display error message when orders API fails with 500", () => {
      cy.intercept("GET", "**/orders", {
        statusCode: 500,
        body: {
          message: "Internal Server Error",
        },
      }).as("getOrdersError");

      cy.visit("/");
      cy.wait("@getOrdersError");

      cy.contains(/error/i).should("be.visible");
    });

    it("should handle network error (no internet)", () => {
      cy.intercept("GET", "**/orders", {
        forceNetworkError: true,
      }).as("getOrdersNetworkError");

      cy.visit("/");

      cy.wait("@getOrdersNetworkError");

      cy.contains(/error|failed/i).should("be.visible");
    });
  });

  describe("Create Order API Errors", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should show error toast when create order API fails", () => {
      cy.intercept("POST", "**/orders", {
        statusCode: 500,
        body: {
          message: "Internal Server Error",
        },
      }).as("createOrderError");

      cy.openCreateOrderDrawer();
      cy.fillOrderForm("Test Product", "99.99");
      cy.submitOrderForm();

      cy.wait("@createOrderError");

      cy.verifyToast("Failed", "error");
    });

    it("should handle network error during order creation", () => {
      cy.intercept("POST", "**/orders", {
        forceNetworkError: true,
      }).as("createOrderNetwork");

      cy.openCreateOrderDrawer();
      cy.fillOrderForm("Network Error Test", "50.00");
      cy.submitOrderForm();

      cy.wait("@createOrderNetwork");

      cy.verifyToast("Failed", "error");
    });

    it("should preserve form data after error", () => {
      cy.intercept("POST", "**/orders", {
        statusCode: 500,
        body: { message: "Server Error" },
      }).as("createOrderPreserve");

      cy.openCreateOrderDrawer();
      cy.fillOrderForm("Preserved Data", "123.45");
      cy.submitOrderForm();

      cy.wait("@createOrderPreserve");

      cy.get(
        'input[placeholder*="item" i], input[name="item"], input[type="text"]'
      )
        .first()
        .should("have.value", "Preserved Data");

      cy.get('input[type="number"], input[placeholder*="price" i]')
        .first()
        .should("have.value", "123.45");
    });
  });

  describe("Update Order API Errors", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should show error toast when updating order fails", () => {
      cy.intercept("PATCH", "**/orders/*", {
        statusCode: 500,
        body: { message: "Failed to update order" },
      }).as("updateOrderError");

      cy.openOrderActions("Laptop");

      cy.contains("Mark as Paid", { timeout: 5000 }).click({ force: true });

      cy.contains("button", /confirm|yes|mark/i, { timeout: 5000 }).click({
        force: true,
      });

      cy.wait("@updateOrderError");

      cy.verifyToast("Failed", "error");
    });
  });

  describe("Delete Order API Errors", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should show error toast when delete order fails", () => {
      cy.intercept("DELETE", "**/orders/*", {
        statusCode: 500,
        body: { message: "Failed to delete order" },
      }).as("deleteOrderError");

      cy.openOrderActions("USB-C Cable");

      cy.contains("Delete Order", { timeout: 5000 }).click({ force: true });

      cy.contains("button", /confirm|yes|delete/i, { timeout: 5000 }).click({
        force: true,
      });

      cy.wait("@deleteOrderError");

      cy.verifyToast("Failed", "error");
    });
  });
});
