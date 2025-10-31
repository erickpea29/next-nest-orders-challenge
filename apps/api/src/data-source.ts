import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from './orders/order.entity';

const url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/orders';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  entities: [Order],
  synchronize: true, // For challenge/dev only; in prod use migrations
  logging: false
});
