import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from 'src/utils/dto';

export class QueryUserResultDTO {
  users: User[];
  count: number;
}

export class QueryUserDTO extends BaseQueryDTO {
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

export class RegisterDTO {
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

export type GetUserResultDTO = Prisma.UserGetPayload<{
  include: {
    bio: true;
    configuration: true;
  };
}>;
