import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { QueryTokenDTO } from './dto/token.dto';
import { SuccessResponseDTO } from 'src/utils/dto';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  private readonly logger = new Logger(TokenController.name);

  @Get()
  async query(@Query() query: QueryTokenDTO): Promise<SuccessResponseDTO> {
    const { chain, limit, page, q } = query;
    const { count, tokens } = await this.tokenService.query(
      {
        limit,
        page,
        q,
      },
      {
        chain: {
          id: chain,
        },
      },
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
