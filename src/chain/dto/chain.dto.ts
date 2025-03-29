import { Chain } from '@prisma/client';
import { BaseQueryDTO } from 'src/utils/dto';

export class QueryChainDTO extends BaseQueryDTO {}

export class QueryChainResultDTO {
  chains: Chain[];
  count: number;
}
