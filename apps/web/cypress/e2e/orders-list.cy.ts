describe("Orders List", () => {
  describe("Loading State", () => {
    it("should display loading state while fetching orders", () => {
      cy.intercept("GET", "**/orders", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            fixture: "orders-success.json",
          });
        });
      }).as("getOrders");

      cy.visit("/");

      cy.contains("Loading orders...").should("be.visible");

      cy.wait("@getOrders");

      cy.contains("Loading orders...").should("not.exist");
    });
  });

  describe("Successful Orders Display", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should display orders list successfully", () => {
      cy.contains("h1", "Orders").should("be.visible");

      cy.get("table").should("be.visible");

      cy.get("table thead").within(() => {
        cy.contains("Item").should("be.visible");
        cy.contains("Price").should("be.visible");
        cy.contains("Status").should("be.visible");
        cy.contains("Actions").should("be.visible");
      });

      cy.verifyTableContains("Laptop");
      cy.verifyTableContains("Wireless Mouse");
      cy.verifyTableContains("USB-C Cable");
      cy.verifyTableContains("Mechanical Keyboard");
      cy.verifyTableContains("Monitor Stand");
    });

    it("should display correct price formatting", () => {
      cy.verifyTableContains("$999.99");
      cy.verifyTableContains("$29.99");
      cy.verifyTableContains("$15.50");
    });

    it("should display status badges with correct styling", () => {
      cy.verifyOrderStatus("Laptop", "NEW");
      cy.verifyOrderStatus("Wireless Mouse", "PAID");
      cy.verifyOrderStatus("USB-C Cable", "CANCELLED");

      cy.getOrderRow("Laptop").within(() => {
        cy.contains("NEW").should("have.css", "background-color");
      });
    });

    it("should display statistics cards with correct counts", () => {
      cy.contains("New Orders").should("be.visible");
      cy.contains("Paid Orders").should("be.visible");
      cy.contains("Cancelled Orders").should("be.visible");

      cy.contains("New Orders").parent().parent().should("contain", "2");

      cy.contains("Paid Orders").parent().parent().should("contain", "2");

      cy.contains("Cancelled Orders").parent().parent().should("contain", "1");
    });

    it("should display Create New Order button", () => {
      cy.contains("button", "Create New Order")
        .should("be.visible")
        .should("not.be.disabled");
    });
  });

  describe("Empty State", () => {
    it("should handle empty orders list gracefully", () => {
      cy.interceptOrdersAPI("orders-empty.json");
      cy.visit("/");
      cy.wait("@getOrders");

      cy.get("table").should("be.visible");

      cy.contains("New Orders").parent().parent().should("contain", "0");
    });
  });
  describe("Table Interactions", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should display actions dropdown for each order", () => {
      cy.get("table thead").contains("Actions").should("be.visible");

      cy.getOrderRow("Laptop").within(() => {
        cy.get("button").filter(":visible").should("exist");
      });
    });

    it("should show correct actions for NEW order", () => {
      cy.getOrderRow("Laptop").within(() => {
        cy.get("button").filter(":visible").last().click({ force: true });
      });
      cy.wait(300);
      cy.contains("Mark as Paid", { timeout: 5000 }).should("be.visible");
      cy.contains("Cancel Order").should("be.visible");
    });

    it("should show correct actions for PAID order", () => {
      cy.getOrderRow("Wireless Mouse").within(() => {
        cy.get("button").filter(":visible").last().click({ force: true });
      });
      cy.wait(300);
      cy.contains("Refund", { timeout: 5000 }).should("be.visible");
    });

    it("should open order details modal when View Details is clicked", () => {
      cy.getOrderRow("Laptop").within(() => {
        cy.get("button").filter(":visible").last().click({ force: true });
      });
      cy.wait(300);

      cy.contains("View Details", { timeout: 5000 })
        .should("be.visible")
        .click();

      cy.url().should("include", "/orders/1");
    });
  });
  describe("Accessibility", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should have accessible table structure", () => {
      cy.get("table").within(() => {
        cy.get("thead").should("exist");
        cy.get("tbody").should("exist");
        cy.get("tr").should("have.length.gt", 0);
      });
    });

    it("should have clickable buttons with proper labels", () => {
      cy.contains("button", "Create New Order")
        .should("be.visible")
        .should("have.text", "Create New Order");
    });
  });

  describe("Responsive Design", () => {
    beforeEach(() => {
      cy.interceptOrdersAPI("orders-success.json");
      cy.visit("/");
      cy.wait("@getOrders");
    });

    it("should display correctly on mobile viewport", () => {
      cy.viewport("iphone-x");

      cy.contains("h1", "Orders").should("be.visible");
      cy.contains("button", "Create New Order").should("be.visible");
    });

    it("should display correctly on tablet viewport", () => {
      cy.viewport("ipad-2");

      cy.contains("h1", "Orders").should("be.visible");
      cy.get("table").should("be.visible");
    });

    it("should display correctly on desktop viewport", () => {
      cy.viewport(1920, 1080);

      cy.contains("h1", "Orders").should("be.visible");
      cy.get("table").should("be.visible");

      cy.contains("New Orders").should("be.visible");
      cy.contains("Paid Orders").should("be.visible");
      cy.contains("Cancelled Orders").should("be.visible");
    });
  });
});
