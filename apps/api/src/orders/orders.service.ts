import { Injectable, OnModuleInit } from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";
import { AppDataSource } from "../data-source";

const idem = new Map<string, string>();

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(private readonly repo: OrdersRepository) {}

  async onModuleInit() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  async list(page: number, size: number, q?: string) {
    return this.repo.list(page, size, q);
  }

  async create(
    dto: { item: string; price: number; status: "NEW" | "PAID" | "CANCELLED" },
    idemKey?: string
  ) {
    if (idemKey && idem.has(idemKey)) {
      const id = idem.get(idemKey)!;
      const { data } = await this.repo.list(1, 1);
      const existing = data.find((o) => o.id === id);
      if (existing) return existing;
    }
    const order = await this.repo.create(dto);
    if (idemKey) idem.set(idemKey, order.id);
    return order;
  }

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async updateStatus(id: string, status: "NEW" | "PAID" | "CANCELLED") {
    return this.repo.updateStatus(id, status);
  }

  async delete(id: string) {
    for (const [key, orderId] of idem.entries()) {
      if (orderId === id) {
        idem.delete(key);
        break;
      }
    }
    return this.repo.delete(id);
  }
}
