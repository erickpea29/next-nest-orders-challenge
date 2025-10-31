import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item!: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ enum: ['NEW', 'PAID', 'CANCELLED'], required: false })
  @IsOptional()
  @IsEnum(['NEW', 'PAID', 'CANCELLED'])
  status?: 'NEW' | 'PAID' | 'CANCELLED';
}
