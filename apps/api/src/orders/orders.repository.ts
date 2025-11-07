import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Order } from "./order.entity";

@Injectable()
export class OrdersRepository {
  repo = AppDataSource.getRepository(Order);

  async list(page = 1, size = 1000, q?: string) {
    const skip = (page - 1) * size;
    const qb = this.repo.createQueryBuilder("o").orderBy("o.createdAt", "DESC");
    if (q) {
      qb.where("LOWER(o.item) LIKE :q", { q: `%${q.toLowerCase()}%` });
    }
    const [data, total] = await qb.skip(skip).take(size).getManyAndCount();
    return { data, total };
  }

  async create(input: {
    item: string;
    price: number;
    status: "NEW" | "PAID" | "CANCELLED";
  }) {
    const entity = this.repo.create({
      ...input,
      price: input.price.toFixed(2),
    });
    return this.repo.save(entity);
  }

  async findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  async updateStatus(id: string, status: "NEW" | "PAID" | "CANCELLED") {
    await this.repo.update({ id }, { status });
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: string) {
    const order = await this.repo.findOneByOrFail({ id });
    await this.repo.remove(order);
    return order;
  }
}
