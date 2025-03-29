import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';
import { QueryTokenDTO, QueryTokenResultDTO } from './dto/token.dto';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TokenService.name);

  async get(payload: Prisma.TokenWhereInput): Promise<Token | null> {
    try {
      return await this.prismaService.token.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in checkTokenIsNotExists', error);
      throw error;
    }
  }

  async query(
    query: QueryTokenDTO,
    opt?: Prisma.TokenWhereInput,
  ): Promise<QueryTokenResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Partial<Prisma.TokenWhereInput> = {
        deleted_at: null,
      };
      if (q) {
        whereQuery.OR = [
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
          {
            symbol: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ];
      }

      if (opt) {
        if (opt.chain_id) {
          whereQuery.chain_id = opt.chain_id;
        }
      }

      const [tokens, count] = await this.prismaService.$transaction([
        this.prismaService.token.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          include: {
            chain: true,
          },
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

  async create(payload: Prisma.TokenCreateInput): Promise<Token> {
    try {
      return await this.prismaService.token.create({
        data: {
          ...payload,
          id: generateCustomId('tkn'),
        },
      });
    } catch (error) {
      this.logger.error('Error in createToken', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Token> {
    try {
      return await this.prismaService.token.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteToken', error);
      throw error;
    }
  }

  async update(id: string, payload: Prisma.TokenUpdateInput): Promise<Token> {
    try {
      return await this.prismaService.token.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in updateToken', error);
      throw error;
    }
  }
}
