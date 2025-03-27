import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/utils/dto';
import { GetStreamerResultDTO } from './dto/streamer.dto';

@Controller('streamer')
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get streamer information',
    description:
      'This endpoint is used to get streamer information based on the streamer username or wallet address.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Streamer fetched successfully',
    schema: {
      example: {
        success: true,
        message: 'Streamer fetched successfully',
        data: {
          streamer: {
            id: 'str-h54tqx0hgv7lxb7vneutg9xm4',
            address: '0x74Bf296288eB66F6837536b579945481841a171C',
            usd_total_support: 12.17855,
            created_at: '2025-03-09T06:35:19.476Z',
            updated_at: '2025-03-09T06:36:43.816Z',
            deleted_at: null,
            bio: {
              id: 'bio-7h4tfx0sgv7lxb7vneutg9xm4',
              username: 'wildanzrrr',
              bio: 'Lorem ipsum dolor sit amet',
              image: 'https://google.com/image.jpg',
              x: 'https://x.com/wildanzrrr',
              tiktok: null,
              instagram: null,
              youtube: null,
              website: null,
              created_at: '2025-03-25T17:44:17.233Z',
              updated_at: '2025-03-25T17:42:10.760Z',
              deleted_at: null,
            },
          },
        },
        status_code: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Streamer not found',
    schema: {
      example: {
        message: 'Streamer not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Param('id') id: string): Promise<SuccessResponseDTO> {
    const streamer = await this.streamerService.get({
      OR: [
        {
          address: id,
        },
        {
          bio: {
            username: id,
          },
        },
      ],
      deleted_at: null,
    });

    if (!streamer) {
      throw new NotFoundException('Streamer not found');
    }

    const satisfiedStreamer: Partial<GetStreamerResultDTO> = streamer;
    delete satisfiedStreamer.stream_key;
    delete satisfiedStreamer?.configuration;

    return {
      success: true,
      message: 'Streamer fetched successfully',
      data: {
        streamer: satisfiedStreamer,
      },
      status_code: HttpStatus.OK,
    };
  }
}
