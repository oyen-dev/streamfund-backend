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

export type GetStreamerResultDTO = Prisma.StreamerGetPayload<{
  include: {
    bio: true;
    configuration: true;
  };
}>;
