import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';
import { CreateTokenDTO, QueryTokenDTO } from './dto/token.dto';
import { PrismaService } from '../prisma.service';
import { generateCustomId } from '../utils/utils';

interface QueryTokenResult {
  tokens: Token[];
  count: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TokenService.name);

  async createToken(payload: CreateTokenDTO): Promise<Token> {
    try {
      const { address, chain, decimal, name, image, symbol } = payload;
      return await this.prismaService.token.create({
        data: {
          id: generateCustomId('token'),
          address,
          chain,
          decimal,
          name,
          symbol,
          image,
        },
      });
    } catch (error) {
      this.logger.error('Error in createToken', error);
      throw error;
    }
  }

  async queryToken(query: QueryTokenDTO): Promise<QueryTokenResult> {
    try {
      const { limit, page, chain, q } = query;
      const whereQuery: Partial<Prisma.TokenWhereInput> = {
        OR: [
          {
            address: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      };

      if (chain) {
        whereQuery.chain = chain;
      }

      const [tokens, count] = await this.prismaService.$transaction([
        this.prismaService.token.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            name: 'asc',
          },
        }),
        this.prismaService.token.count({
          where: whereQuery,
        }),
      ]);

      return {
        tokens,
        count,
      };
    } catch (error) {
      this.logger.error('Error in queryToken', error);
      throw error;
    }
  }

  async deleteToken(address: string, chain: number): Promise<Token> {
    try {
      const token = await this.getTokenByAddressAndChain(address, chain);
      if (!token) {
        throw new Error('Token not found');
      }

      return await this.prismaService.token.delete({
        where: {
          address,
          chain,
          id: token.id,
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteToken', error);
      throw error;
    }
  }

  async getTokenByAddressAndChain(
    address: string,
    chain: number,
  ): Promise<Token | null> {
    try {
      const token = await this.prismaService.token.findFirst({
        where: {
          address,
          chain,
        },
      });
      return token;
    } catch (error) {
      this.logger.error('Error in checkTokenIsNotExists', error);
      throw error;
    }
  }
}
