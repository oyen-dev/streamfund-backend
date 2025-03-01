import { Injectable, Logger } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';
import { CreateTokenDTO } from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(TokenService.name);

  async createToken(payload: CreateTokenDTO): Promise<Token> {
    try {
      const isNotExists = await this.checkTokenIsNotExists(
        payload.address,
        payload.chain,
      );
      if (!isNotExists) {
        throw new Error('Token already exists');
      }
      return await this.prismaService.token.create({
        data: {
          id: generateCustomId('token'),
          address: payload.address,
          chain: payload.chain,
          decimal: payload.decimal,
          name: payload.name,
          image: payload.image,
        },
      });
    } catch (error) {
      this.logger.error('Error in createToken', error);
      throw error;
    }
  }

  private async checkTokenIsNotExists(
    address: string,
    chain: number,
  ): Promise<boolean> {
    try {
      const token = await this.prismaService.token.findFirst({
        where: {
          address,
          chain,
        },
      });
      return !token;
    } catch (error) {
      this.logger.error('Error in checkTokenIsNotExists', error);
      throw error;
    }
  }
}
