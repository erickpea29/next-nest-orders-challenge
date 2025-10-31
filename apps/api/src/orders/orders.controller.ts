import { Controller, Get, Post, Body, Query, Patch, Param, Headers } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrdersService } from './orders.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiQuery({ name: 'q', required: false, example: 'matcha' })
  list(@Query('page') page = '1', @Query('size') size = '10', @Query('q') q?: string) {
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const s = Math.min(100, Math.max(1, parseInt(String(size), 10) || 10));
    return this.svc.list(p, s, q);
  }

  @Post()
  create(@Body() body: CreateOrderDto, @Headers('Idempotency-Key') idem?: string) {
    return this.svc.create({ item: body.item, price: body.price, status: body.status || 'NEW' }, idem);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.svc.updateStatus(id, body.status);
  }
}
