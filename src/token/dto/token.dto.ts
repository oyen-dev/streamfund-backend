import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from '../../utils/dto';

export class CreateTokenDTO {
  address: string;
  chain: number;
  decimal: number;
  name: string;
  symbol: string;
  coin_gecko_id: string;
  image: string;
}

export class QueryTokenResultDTO {
  tokens: Token[];
  count: number;
}

export class QueryTokenDTO extends BaseQueryDTO {
  @ApiProperty({
    description: 'Chain ID',
    example: '1',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsString()
  chain_id?: string;
}
