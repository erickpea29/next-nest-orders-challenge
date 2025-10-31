import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';

test('creates an order', async () => {
  const repo = new OrdersRepository();
  const svc = new OrdersService(repo);
  await svc.onModuleInit();
  const o = await svc.create({ item: 'Matcha Latte', price: 85, status: 'NEW' });
  expect(o.id).toBeDefined();
  expect(o.item).toBe('Matcha Latte');
});
