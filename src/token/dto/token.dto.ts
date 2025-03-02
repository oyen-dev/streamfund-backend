import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class CreateTokenDTO {
  address: string;
  chain: number;
  decimal: number;
  name: string;
  image?: string | null | undefined;
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
