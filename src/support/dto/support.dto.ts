import { Support } from '@prisma/client';
import { BaseQueryDTO } from 'src/utils/dto';

export class CreateSupportDTO {
  usd_amount: number;
  hash: string;
  data: string;
  viewerId: string;
  streamerId: string;
  tokenId: string;
  revenueId: string;
  topSupportId: string;
  topSupporterId: string;
}

export class QuerySupportDTO extends BaseQueryDTO {
  tokenId?: string;
  fromId?: string;
  toId?: string;
}

export class QuerySupportResultDTO {
  supports: Support[];
  count: number;
}
