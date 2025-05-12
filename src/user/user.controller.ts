import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/utils/dto';
import { GetUserResultDTO, RegisterDTO } from './dto/user.dto';
import { generateCustomId } from 'src/utils/utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user information',
    description:
      'This endpoint is used to get user information based on the user username or wallet address.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User fetched successfully',
    schema: {
      example: {
        success: true,
        message: 'User fetched successfully',
        data: {
          user: {
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
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Param('id') id: string): Promise<SuccessResponseDTO> {
    const user = await this.userService.get({
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const satisfiedUser: Partial<GetUserResultDTO> = user;
    delete satisfiedUser.stream_key;
    delete satisfiedUser?.configuration;

    return {
      success: true,
      message: 'User fetched successfully',
      data: {
        user: satisfiedUser,
      },
      status_code: HttpStatus.OK,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register as a user',
    description:
      'This endpoint is used to register as a user. The wallet address is required.',
  })
  async register(@Body() payload: RegisterDTO): Promise<SuccessResponseDTO> {
    const user = await this.userService.create({
      address: payload.wallet_address,
      bio: {
        create: {
          id: generateCustomId('bio'),
          username: payload.username,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user,
      },
      status_code: HttpStatus.OK,
    };
  }
}
