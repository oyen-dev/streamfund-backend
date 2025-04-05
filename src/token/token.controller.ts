import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { QueryTokenDTO, TokenWithPrice } from './dto/token.dto';
import { SuccessResponseDTO } from 'src/utils/dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoingeckoService } from 'src/coingecko/coingecko.service';

@Controller('tokens')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly coingeckoService: CoingeckoService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query tokens',
    description:
      "This endpoint is used to query tokens based on the chain ID, limit, page, and query string. The query string is used to search for tokens based on the token's name or symbol.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens queried successfully',
    schema: {
      example: {
        success: true,
        message: 'Token queried successfully',
        metadata: {
          page: 1,
          limit: 10,
          total: 1,
        },
        data: {
          tokens: [
            {
              id: 'tkn-uaeo5c045c9ru08oy0oaq9a2z',
              address: '0x5904a1CCE53A9e84CAeF1035B386978aF2F83725',
              decimal: 6,
              name: 'USDC',
              symbol: 'USDC',
              image:
                'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
              coin_gecko_id: 'usd-coin',
              chain_id: 'chn-syydakdnkxw8o691u3jk2slhr',
              created_at: '2025-03-09T06:33:34.808Z',
              updated_at: '2025-03-09T06:33:34.808Z',
              deleted_at: null,
              chain: {
                id: 'chn-syydakdnkxw8o691u3jk2slhr',
                name: 'Base Sepolia',
                chain_id: 84532,
                block_explorer_url: 'https://sepolia.basescan.org',
                image:
                  'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
                created_at: '2025-03-09T06:32:33.362Z',
                updated_at: '2025-03-09T06:32:33.362Z',
                deleted_at: null,
              },
            },
          ],
        },
        status_code: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
    schema: {
      example: {
        message: ['limit must be one of the following values: 10, 20, 50, 100'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async query(@Query() query: QueryTokenDTO): Promise<SuccessResponseDTO> {
    const { chain_id, limit, page, q } = query;
    const { count, tokens: tempTokens } = await this.tokenService.query(
      {
        limit,
        page,
        q,
      },
      {
        chain_id,
      },
    );

    const tokens: TokenWithPrice[] = await Promise.all(
      tempTokens.map(async (token) => {
        const price = await this.coingeckoService.getCoinPrice(
          token.coin_gecko_id,
        );
        return {
          ...token,
          price,
        };
      }),
    );

    return {
      success: true,
      message: 'Token queried successfully',
      metadata: {
        page,
        limit,
        total: count,
      },
      data: {
        tokens,
      },
      status_code: HttpStatus.OK,
    };
  }
}
