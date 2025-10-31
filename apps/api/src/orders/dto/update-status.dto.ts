import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['NEW', 'PAID', 'CANCELLED'] })
  @IsEnum(['NEW', 'PAID', 'CANCELLED'])
  status!: 'NEW' | 'PAID' | 'CANCELLED';
}
