import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage, SiweResponse } from 'siwe';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  async verifySiweMessage(
    message: string,
    signature: string,
  ): Promise<SiweResponse | null> {
    try {
      const siweMessage = new SiweMessage(message);
      return await siweMessage.verify({
        signature: signature,
        domain: siweMessage.domain,
        nonce: siweMessage.nonce,
      });
    } catch (error) {
      this.logger.error('Error in verifySiweMessage', error);
      return null;
    }
  }

  generateJwtToken(address: string): string {
    return this.jwtService.sign({ address });
  }
}
