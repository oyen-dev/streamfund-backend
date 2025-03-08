import { ApiProperty } from '@nestjs/swagger';
import { FeeCollector } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class QueryFeeCollectorResultDTO {
  collectors: FeeCollector[];
  count: number;
}

export class QueryFeeCollectorDTO extends BaseQueryDTO {
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
