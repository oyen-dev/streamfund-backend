import { ApiProperty } from '@nestjs/swagger';
import { Revenue } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class QueryRevenueResultDTO {
  revenues: Revenue[];
  count: number;
}

export class QueryRevenueDTO extends BaseQueryDTO {
  @ApiProperty({
    description: 'Chain ID',
    example: 'TvRL',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  chain?: number;
}
