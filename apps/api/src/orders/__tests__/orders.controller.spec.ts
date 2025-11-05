import { Test, TestingModule } from "@nestjs/testing";
import { MockProxy, mock } from "jest-mock-extended";
import { OrdersController } from "../orders.controller";
import { OrdersService } from "../orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import {
  createMockOrder,
  createMockOrders,
  createMockPaginationResult,
} from "../../../test/helpers";

type OrderStatus = "NEW" | "PAID" | "CANCELLED";

describe("OrdersController", () => {
  let controller: OrdersController;
  let mockService: MockProxy<OrdersService>;

  beforeEach(async () => {
    mockService = mock<OrdersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return paginated orders with default parameters", async () => {
      const mockOrders = createMockOrders(3);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockService.list.mockResolvedValue(expectedResult);

      const result = await controller.list();

      expect(mockService.list).toHaveBeenCalledWith(1, 10, undefined);
      expect(result).toEqual(expectedResult);
    });

    it("should parse and pass page and size parameters", async () => {
      const mockOrders = createMockOrders(5);
      const expectedResult = createMockPaginationResult(mockOrders, 45);

      mockService.list.mockResolvedValue(expectedResult);

      const result = await controller.list("2", "20");

      expect(mockService.list).toHaveBeenCalledWith(2, 20, undefined);
      expect(result).toEqual(expectedResult);
    });

    it("should pass search query parameter to service", async () => {
      const mockOrders = createMockOrders(1);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockService.list.mockResolvedValue(expectedResult);

      await controller.list("1", "10", "Matcha");

      expect(mockService.list).toHaveBeenCalledWith(1, 10, "Matcha");
    });

    it("should enforce maximum size value of 100", async () => {
      const mockOrders = createMockOrders(3);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockService.list.mockResolvedValue(expectedResult);

      await controller.list("1", "150");

      expect(mockService.list).toHaveBeenCalledWith(1, 100, undefined);
    });

    it("should handle invalid parameters gracefully", async () => {
      const mockOrders = createMockOrders(3);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockService.list.mockResolvedValue(expectedResult);

      await controller.list("invalid", "invalid");

      expect(mockService.list).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe("create", () => {
    it("should create order with valid DTO", async () => {
      const dto: CreateOrderDto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW",
      };
      const mockOrder = createMockOrder({
        item: dto.item,
        price: "85.00",
        status: dto.status,
      });

      mockService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(
        { item: dto.item, price: dto.price, status: dto.status },
        undefined
      );
      expect(result).toEqual(mockOrder);
    });

    it("should create order with idempotency key header", async () => {
      const dto: CreateOrderDto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW",
      };
      const idempotencyKey = "idem-key-123";
      const mockOrder = createMockOrder();

      mockService.create.mockResolvedValue(mockOrder);

      await controller.create(dto, idempotencyKey);

      expect(mockService.create).toHaveBeenCalledWith(
        { item: dto.item, price: dto.price, status: dto.status },
        idempotencyKey
      );
    });

    it("should handle all valid order statuses", async () => {
      const statuses: OrderStatus[] = ["NEW", "PAID", "CANCELLED"];

      for (const status of statuses) {
        const dto: CreateOrderDto = {
          item: "Test Item",
          price: 10,
          status,
        };
        const mockOrder = createMockOrder({ status });

        mockService.create.mockResolvedValue(mockOrder);

        const result = await controller.create(dto);

        expect(result.status).toBe(status);
      }
    });
  });

  describe("findOne", () => {
    it("should return order by id", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne(orderId);

      expect(mockService.findOne).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it("should propagate error when order not found", async () => {
      const orderId = "non-existent-id";
      const error = new Error("Order not found");

      mockService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(orderId)).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("updateStatus", () => {
    it("should update order status", async () => {
      const orderId = "test-uuid-123";
      const dto: UpdateStatusDto = { status: "PAID" };
      const mockOrder = createMockOrder({ id: orderId, status: "PAID" });

      mockService.updateStatus.mockResolvedValue(mockOrder);

      const result = await controller.updateStatus(orderId, dto);

      expect(mockService.updateStatus).toHaveBeenCalledWith(
        orderId,
        dto.status
      );
      expect(result.status).toBe("PAID");
    });

    it("should handle all status transitions", async () => {
      const orderId = "test-uuid-123";
      const statuses: OrderStatus[] = ["NEW", "PAID", "CANCELLED"];

      for (const status of statuses) {
        const dto: UpdateStatusDto = { status };
        const mockOrder = createMockOrder({ id: orderId, status });

        mockService.updateStatus.mockResolvedValue(mockOrder);

        const result = await controller.updateStatus(orderId, dto);

        expect(result.status).toBe(status);
      }
    });

    it("should propagate error when updating non-existent order", async () => {
      const orderId = "non-existent-id";
      const dto: UpdateStatusDto = { status: "PAID" };
      const error = new Error("Order not found");

      mockService.updateStatus.mockRejectedValue(error);

      await expect(controller.updateStatus(orderId, dto)).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("delete", () => {
    it("should delete order by id", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockService.delete.mockResolvedValue(mockOrder);

      const result = await controller.delete(orderId);

      expect(mockService.delete).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it("should propagate error when deleting non-existent order", async () => {
      const orderId = "non-existent-id";
      const error = new Error("Order not found");

      mockService.delete.mockRejectedValue(error);

      await expect(controller.delete(orderId)).rejects.toThrow(
        "Order not found"
      );
    });
  });
});
