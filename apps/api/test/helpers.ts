import { Order } from "../src/orders/order.entity";

type OrderStatus = "NEW" | "PAID" | "CANCELLED";

export const createMockOrder = (overrides?: Partial<Order>): Order => {
  const order = new Order();
  order.id = overrides?.id ?? "test-uuid-123";
  order.item = overrides?.item ?? "Test Item";
  order.price = overrides?.price ?? "10.00";
  order.status = overrides?.status ?? "NEW";
  order.createdAt = overrides?.createdAt ?? new Date("2025-01-01T00:00:00Z");
  order.updatedAt = overrides?.updatedAt ?? new Date("2025-01-01T00:00:00Z");
  return order;
};

export const createMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockOrder({
      id: `test-uuid-${i}`,
      item: `Test Item ${i}`,
      price: `${(i + 1) * 10}.00`,
    })
  );
};

export const createMockCreateOrderDto = (overrides?: {
  item?: string;
  price?: number;
  status?: OrderStatus;
}) => ({
  item: overrides?.item ?? "Matcha Latte",
  price: overrides?.price ?? 85,
  status: overrides?.status ?? "NEW",
});

export const createMockUpdateStatusDto = (status: OrderStatus = "PAID") => ({
  status,
});

export const createMockPaginationResult = (
  data: Order[],
  total?: number
): { data: Order[]; total: number } => ({
  data,
  total: total ?? data.length,
});
