import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDTO } from './dto/auth.dto';
import { SuccessResponseDTO } from 'src/utils/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in',
    description:
      'This endpoint is used to sign in a user. It returns a JWT token if the sign in is successful.',
  })
  async login(@Body() payload: LoginDTO): Promise<SuccessResponseDTO> {
    const { message, signature, address } = payload;
    const siweResponse = await this.authService.verifySiweMessage(
      message,
      signature,
    );

    if (!siweResponse) {
      throw new UnauthorizedException(
        'Invalid signature or message. Please check your credentials.',
      );
    }

    const { data } = siweResponse;
    if (data.address.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException(
        'Mismatched address. Please check your credentials.',
      );
    }

    const token = this.authService.generateJwtToken(address);

    return {
      success: true,
      message: 'Login successfully',
      data: {
        ...data,
        token,
      },
      status_code: 200,
    };
  }
}
