import { Test, TestingModule } from "@nestjs/testing";
import { mock, MockProxy } from "jest-mock-extended";
import { OrdersService } from "../orders.service";
import { OrdersRepository } from "../orders.repository";
import { AppDataSource } from "../../data-source";
import {
  createMockOrder,
  createMockOrders,
  createMockPaginationResult,
} from "../../../test/helpers";

jest.mock("../../data-source", () => ({
  AppDataSource: {
    isInitialized: false,
    initialize: jest.fn(),
  },
}));

type OrderStatus = "NEW" | "PAID" | "CANCELLED";

describe("OrdersService", () => {
  let service: OrdersService;
  let mockRepository: MockProxy<OrdersRepository>;

  beforeEach(async () => {
    mockRepository = mock<OrdersRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);

    (AppDataSource.isInitialized as boolean) = true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("onModuleInit", () => {
    it("should initialize AppDataSource if not already initialized", async () => {
      (AppDataSource.isInitialized as boolean) = false;
      (AppDataSource.initialize as jest.Mock).mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(AppDataSource.initialize).toHaveBeenCalledTimes(1);
    });

    it("should not initialize AppDataSource if already initialized", async () => {
      (AppDataSource.isInitialized as boolean) = true;

      await service.onModuleInit();

      expect(AppDataSource.initialize).not.toHaveBeenCalled();
    });
  });

  describe("list", () => {
    it("should delegate to repository and return paginated orders", async () => {
      const mockOrders = createMockOrders(3);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockRepository.list.mockResolvedValue(expectedResult);

      const result = await service.list(1, 10);

      expect(mockRepository.list).toHaveBeenCalledWith(1, 10, undefined);
      expect(result).toEqual(expectedResult);
    });

    it("should pass search query to repository", async () => {
      const mockOrders = createMockOrders(1);
      const expectedResult = createMockPaginationResult(mockOrders);

      mockRepository.list.mockResolvedValue(expectedResult);

      await service.list(1, 10, "Matcha");

      expect(mockRepository.list).toHaveBeenCalledWith(1, 10, "Matcha");
    });
  });

  describe("create", () => {
    it("should create a new order when no idempotency key is provided", async () => {
      const dto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW" as OrderStatus,
      };
      const mockOrder = createMockOrder({
        item: dto.item,
        price: "85.00",
        status: dto.status,
      });

      mockRepository.create.mockResolvedValue(mockOrder);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockOrder);
    });

    it("should create a new order and cache idempotency key", async () => {
      const dto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW" as OrderStatus,
      };
      const idempotencyKey = "idem-key-123";
      const mockOrder = createMockOrder({ id: "order-id-456" });

      mockRepository.create.mockResolvedValue(mockOrder);

      const result = await service.create(dto, idempotencyKey);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockOrder);
    });

    it("should return existing order when idempotency key is reused", async () => {
      const dto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW" as OrderStatus,
      };
      const idempotencyKey = "idem-key-reuse-test";
      const existingOrder = createMockOrder({ id: "order-id-456" });

      mockRepository.create.mockResolvedValue(existingOrder);

      const firstResult = await service.create(dto, idempotencyKey);

      mockRepository.list.mockResolvedValue(
        createMockPaginationResult([existingOrder])
      );

      const result = await service.create(dto, idempotencyKey);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.list).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(existingOrder);
      expect(result.id).toBe(firstResult.id);
    });

    it("should create new order if cached order ID not found in repository", async () => {
      const dto = {
        item: "Matcha Latte",
        price: 85,
        status: "NEW" as OrderStatus,
      };
      const idempotencyKey = "idem-key-not-found-test";
      const firstOrder = createMockOrder({ id: "order-id-456" });
      const secondOrder = createMockOrder({ id: "order-id-789" });

      mockRepository.create.mockResolvedValueOnce(firstOrder);

      await service.create(dto, idempotencyKey);

      mockRepository.list.mockResolvedValue(createMockPaginationResult([]));
      mockRepository.create.mockResolvedValueOnce(secondOrder);

      const result = await service.create(dto, idempotencyKey);

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(secondOrder);
    });
  });

  describe("findOne", () => {
    it("should delegate to repository and return order by id", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);

      expect(mockRepository.findOne).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it("should propagate error when order is not found", async () => {
      const error = new Error("Order not found");

      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne("non-existent-id")).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("updateStatus", () => {
    it("should delegate to repository and return updated order", async () => {
      const orderId = "test-uuid-123";
      const newStatus: OrderStatus = "PAID";
      const mockOrder = createMockOrder({ id: orderId, status: newStatus });

      mockRepository.updateStatus.mockResolvedValue(mockOrder);

      const result = await service.updateStatus(orderId, newStatus);

      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        orderId,
        newStatus
      );
      expect(result.status).toBe(newStatus);
    });

    it("should propagate error when updating non-existent order", async () => {
      const error = new Error("Order not found");

      mockRepository.updateStatus.mockRejectedValue(error);

      await expect(
        service.updateStatus("non-existent-id", "PAID")
      ).rejects.toThrow("Order not found");
    });
  });

  describe("delete", () => {
    it("should delete order and remove from idempotency cache", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockRepository.delete.mockResolvedValue(mockOrder);

      const result = await service.delete(orderId);

      expect(mockRepository.delete).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it("should propagate error when deleting non-existent order", async () => {
      const error = new Error("Order not found");

      mockRepository.delete.mockRejectedValue(error);

      await expect(service.delete("non-existent-id")).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("Idempotency key management", () => {
    it("should handle multiple different idempotency keys", async () => {
      const dto1 = { item: "Item 1", price: 10, status: "NEW" as OrderStatus };
      const dto2 = { item: "Item 2", price: 20, status: "NEW" as OrderStatus };
      const order1 = createMockOrder({ id: "order-1" });
      const order2 = createMockOrder({ id: "order-2" });

      mockRepository.create
        .mockResolvedValueOnce(order1)
        .mockResolvedValueOnce(order2);

      await service.create(dto1, "idem-key-1");
      await service.create(dto2, "idem-key-2");

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
    });

    it("should not interfere with orders without idempotency keys", async () => {
      const dto = { item: "Item", price: 10, status: "NEW" as OrderStatus };
      const mockOrder1 = createMockOrder({ id: "order-1" });
      const mockOrder2 = createMockOrder({ id: "order-2" });

      mockRepository.create
        .mockResolvedValueOnce(mockOrder1)
        .mockResolvedValueOnce(mockOrder2);

      const result1 = await service.create(dto);
      const result2 = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledTimes(2);
      expect(result1.id).toBe("order-1");
      expect(result2.id).toBe("order-2");
    });
  });
});
