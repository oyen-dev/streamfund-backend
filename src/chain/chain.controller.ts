import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { ChainService } from './chain.service';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/utils/dto';
import { QueryChainDTO } from './dto/chain.dto';

@Controller('chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}
  private readonly logger = new Logger(ChainController.name);

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query chains',
    parameters: [
      {
        in: 'query',
        name: 'limit',
        required: true,
      },
      {
        in: 'query',
        name: 'page',
        required: true,
      },
      {
        in: 'query',
        name: 'q',
        required: false,
      },
    ],
  })
  async query(@Query() query: QueryChainDTO): Promise<SuccessResponseDTO> {
    const { limit, page, q } = query;
    const { chains, count } = await this.chainService.query({
      limit,
      page,
      q,
    });

    return {
      success: true,
      message: 'Chain queried successfully',
      metadata: {
        page,
        limit,
        total: count,
      },
      data: {
        chains,
      },
      status_code: HttpStatus.OK,
    };
  }
}
