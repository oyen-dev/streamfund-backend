import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Streamer } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class QueryStreamerResultDTO {
  streamers: Streamer[];
  count: number;
}

export class QueryStreamerDTO extends BaseQueryDTO {
  @ApiProperty({
    description: 'Username',
    example: 'meoww',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  username?: string;
}

export class RegisterAsStreamer {
  @ApiProperty({
    description: 'Wallet address',
    example: '0x74Bf296288eB66F6837536b579945481841a171C',
    required: true,
    type: String,
  })
  @IsString()
  wallet_address: string;

  @ApiProperty({
    description: 'Username',
    example: 'meoww',
    required: true,
    type: String,
  })
  @IsString()
  username: string;
}

export type GetStreamerResultDTO = Prisma.StreamerGetPayload<{
  include: {
    bio: true;
    configuration: true;
  };
}>;
