import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/utils/dto';
import { QueryChainDTO } from './dto/chain.dto';

@Controller('chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query chains',
    description:
      "This endpoint is used to query chains based on the limit, page, and query string. The query string is used to search for chains based on the chain's name.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chains retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Chain queried successfully',
        metadata: {
          page: 1,
          limit: 10,
          total: 1,
        },
        data: {
          chains: [
            {
              id: 'chn-bc4e9buuja7qsdnumualzhi0i',
              name: 'Arbitrum Sepolia',
              chain_id: 421614,
              block_explorer_url: 'https://sepolia.arbiscan.io',
              image:
                'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
              created_at: '2025-03-09T06:32:33.383Z',
              updated_at: '2025-03-09T06:32:33.383Z',
              deleted_at: null,
              collector: [
                {
                  id: 'fcr-w29xz4f5yvkhifh1ijvfxwgk4',
                  address: '0x5E4194B0A83Ee2f21D67D5c4bF73CFcfCFc5AF61',
                  chain_id: 'chn-bc4e9buuja7qsdnumualzhi0i',
                  usd_total: 0,
                  created_at: '2025-03-09T06:32:33.391Z',
                  updated_at: '2025-03-09T06:32:33.391Z',
                  deleted_at: null,
                },
              ],
            },
          ],
        },
        status_code: HttpStatus.OK,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      example: {
        message: ['limit must be one of the following values: 10, 20, 50, 100'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
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
