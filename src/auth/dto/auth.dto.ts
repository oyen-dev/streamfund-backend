import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Siwe message',
    example: `localhost:3000 wants you to sign in with your Ethereum account:
    0x20047D546F34DC8A58F8DA13fa22143B4fC5404a

    You are signing in to StreamFund on 4/28/2025, 10:22:33 PM

    URI: http://localhost:3000
    Version: 1
    Chain ID: 84532
    Nonce: 84c8fab0ce62e2c1275d1114191a742525b1515f91be7925fdd08f1b59455184dd454966e3e2239605adc0b44ff27779
    Issued At: 2025-04-28T15:22:33.552Z
    Expiration Time: 2025-04-29T15:22:33.552Z`,
    required: true,
    type: String,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Signature',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    required: true,
    type: String,
  })
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Wallet address',
    example: '0x74Bf296288eB66F6837536b579945481841a171C',
    required: true,
    type: String,
  })
  @IsString()
  address: string;
}
