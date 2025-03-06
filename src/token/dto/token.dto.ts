import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class CreateTokenDTO {
  address: string;
  chain: number;
  decimal: number;
  name: string;
  symbol: string;
  coinGeckoId: string;
  image?: string | null | undefined;
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
  @IsNumber()
  chain?: number;
}
