import { Support } from '@prisma/client';
import { BaseQueryDTO } from 'src/utils/dto';

export class CreateSupportDTO {
  usd_amount: number;
  token_amount: bigint;
  hash: string;
  data: string;
  viewer_id: string;
  streamer_id: string;
  token_id: string;
  collector_id: string;
  top_support_id: string;
  top_supporter_id: string;
}

export class QuerySupportDTO extends BaseQueryDTO {
  token_id?: string;
  from_id?: string;
  to_id?: string;
}

export class QuerySupportResultDTO {
  supports: Support[];
  count: number;
}
