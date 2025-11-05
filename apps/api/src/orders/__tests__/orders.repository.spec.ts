import { Repository, SelectQueryBuilder } from "typeorm";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { OrdersRepository } from "../orders.repository";
import { Order } from "../order.entity";
import { AppDataSource } from "../../data-source";
import { createMockOrder, createMockOrders } from "../../../test/helpers";

jest.mock("../../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    isInitialized: true,
  },
}));

type OrderStatus = "NEW" | "PAID" | "CANCELLED";

describe("OrdersRepository", () => {
  let repository: OrdersRepository;
  let mockTypeOrmRepo: MockProxy<Repository<Order>>;
  let mockQueryBuilder: MockProxy<SelectQueryBuilder<Order>>;

  beforeEach(() => {
    mockTypeOrmRepo = mockDeep<Repository<Order>>();
    mockQueryBuilder = mockDeep<SelectQueryBuilder<Order>>();

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockTypeOrmRepo);

    repository = new OrdersRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return paginated orders without search query", async () => {
      const mockOrders = createMockOrders(3);

      mockTypeOrmRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.skip.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.take.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 3]);

      const result = await repository.list(1, 10);

      expect(result).toEqual({ data: mockOrders, total: 3 });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });

    it("should apply search filter when query parameter is provided", async () => {
      const mockOrders = createMockOrders(1);

      mockTypeOrmRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.skip.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.take.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 1]);

      const result = await repository.list(1, 10, "Matcha");

      expect(result).toEqual({ data: mockOrders, total: 1 });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "LOWER(o.item) LIKE :q",
        { q: "%matcha%" }
      );
    });

    it("should calculate correct skip value for pagination", async () => {
      const mockOrders = createMockOrders(2);
      const expectedSkip = 10;

      mockTypeOrmRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.skip.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.take.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockOrders, 25]);

      await repository.list(3, 5);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(expectedSkip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });
  });

  describe("create", () => {
    it("should create and save a new order with formatted price", async () => {
      const input = {
        item: "Matcha Latte",
        price: 85.5,
        status: "NEW" as OrderStatus,
      };
      const mockOrder = createMockOrder({
        item: input.item,
        price: "85.50",
        status: input.status,
      });

      mockTypeOrmRepo.create.mockReturnValue(mockOrder);
      mockTypeOrmRepo.save.mockResolvedValue(mockOrder);

      const result = await repository.create(input);

      expect(mockTypeOrmRepo.create).toHaveBeenCalledWith({
        item: input.item,
        price: "85.50",
        status: input.status,
      });
      expect(result).toEqual(mockOrder);
    });

    it("should format price to exactly 2 decimal places", async () => {
      const input = {
        item: "Coffee",
        price: 100,
        status: "NEW" as OrderStatus,
      };
      const mockOrder = createMockOrder({ price: "100.00" });

      mockTypeOrmRepo.create.mockReturnValue(mockOrder);
      mockTypeOrmRepo.save.mockResolvedValue(mockOrder);

      await repository.create(input);

      expect(mockTypeOrmRepo.create).toHaveBeenCalledWith({
        item: input.item,
        price: "100.00",
        status: input.status,
      });
    });
  });

  describe("findOne", () => {
    it("should find and return an order by id", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockTypeOrmRepo.findOneByOrFail.mockResolvedValue(mockOrder);

      const result = await repository.findOne(orderId);

      expect(mockTypeOrmRepo.findOneByOrFail).toHaveBeenCalledWith({
        id: orderId,
      });
      expect(result).toEqual(mockOrder);
    });

    it("should throw error when order is not found", async () => {
      const orderId = "non-existent-id";
      const error = new Error("Order not found");

      mockTypeOrmRepo.findOneByOrFail.mockRejectedValue(error);

      await expect(repository.findOne(orderId)).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("updateStatus", () => {
    it("should update order status and return updated order", async () => {
      const orderId = "test-uuid-123";
      const newStatus: OrderStatus = "PAID";
      const mockOrder = createMockOrder({ id: orderId, status: newStatus });

      mockTypeOrmRepo.update.mockResolvedValue({} as any);
      mockTypeOrmRepo.findOneByOrFail.mockResolvedValue(mockOrder);

      const result = await repository.updateStatus(orderId, newStatus);

      expect(mockTypeOrmRepo.update).toHaveBeenCalledWith(
        { id: orderId },
        { status: newStatus }
      );
      expect(result.status).toBe(newStatus);
    });

    it("should throw error when updating non-existent order", async () => {
      const orderId = "non-existent-id";
      const error = new Error("Order not found");

      mockTypeOrmRepo.update.mockResolvedValue({} as any);
      mockTypeOrmRepo.findOneByOrFail.mockRejectedValue(error);

      await expect(repository.updateStatus(orderId, "PAID")).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("delete", () => {
    it("should find, remove, and return the deleted order", async () => {
      const orderId = "test-uuid-123";
      const mockOrder = createMockOrder({ id: orderId });

      mockTypeOrmRepo.findOneByOrFail.mockResolvedValue(mockOrder);
      mockTypeOrmRepo.remove.mockResolvedValue(mockOrder);

      const result = await repository.delete(orderId);

      expect(mockTypeOrmRepo.findOneByOrFail).toHaveBeenCalledWith({
        id: orderId,
      });
      expect(mockTypeOrmRepo.remove).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });

    it("should throw error when deleting non-existent order", async () => {
      const orderId = "non-existent-id";
      const error = new Error("Order not found");

      mockTypeOrmRepo.findOneByOrFail.mockRejectedValue(error);

      await expect(repository.delete(orderId)).rejects.toThrow(
        "Order not found"
      );
      expect(mockTypeOrmRepo.remove).not.toHaveBeenCalled();
    });
  });
});
