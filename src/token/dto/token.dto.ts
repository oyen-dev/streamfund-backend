import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseQueryDTO } from '../../utils/dto';

export class CreateTokenDTO {
  address: string;
  chain: number;
  decimal: number;
  name: string;
  symbol: string;
  coinGeckoId: string;
  image: string;
}

export class QueryTokenResultDTO {
  tokens: Token[];
  count: number;
}

export class QueryTokenDTO extends BaseQueryDTO {
  @ApiProperty({
    description: 'Chain ID',
    example: 'TvRL',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  chain?: number;
}
