import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { QueryTokenDTO } from './dto/token.dto';
import { SuccessResponseDTO } from 'src/utils/dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  private readonly logger = new Logger(TokenController.name);

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query tokens',
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
      {
        in: 'query',
        name: 'chain_id',
        required: false,
      },
    ],
  })
  async query(@Query() query: QueryTokenDTO): Promise<SuccessResponseDTO> {
    const { chain_id, limit, page, q } = query;
    const { count, tokens } = await this.tokenService.query(
      {
        limit,
        page,
        q,
      },
      {
        chain_id,
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
