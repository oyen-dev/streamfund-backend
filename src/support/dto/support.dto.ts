import { Support } from '@prisma/client';
import { BaseQueryDTO } from 'src/utils/dto';

export class CreateSupportDTO {
  usd_amount: number;
  token_amount: number;
  hash: string;
  data: string;
  viewer_id: string;
  streamer_id: string;
  token_id: string;
  collector_id: string;
  topSupport_id: string;
  topSupporter_id: string;
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
