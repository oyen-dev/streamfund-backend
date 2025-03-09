import { Injectable, Logger } from '@nestjs/common';
import { Chain, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { QueryChainDTO, QueryChainResultDTO } from './dto/chain.dto';
import { generateCustomId } from 'src/utils/utils';

@Injectable()
export class ChainService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(ChainService.name);

  async get(payload: Prisma.ChainWhereInput): Promise<Chain | null> {
    try {
      return await this.prismaService.chain.findFirst({
        where: payload,
      });
    } catch (error) {
      this.logger.error('Error in get', error);
      throw error;
    }
  }

  async query(
    query: QueryChainDTO,
    opt?: Prisma.ChainWhereInput,
  ): Promise<QueryChainResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Prisma.ChainWhereInput = {
        deleted_at: null,
      };

      if (q) {
        whereQuery.OR = [
          {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ];
      }

      if (opt) {
        if (opt?.chain_id) {
          whereQuery.chain_id = opt.chain_id;
        }
      }

      const [chains, count] = await this.prismaService.$transaction([
        this.prismaService.chain.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            name: 'asc',
          },
        }),
        this.prismaService.chain.count({
          where: whereQuery,
        }),
      ]);

      return {
        chains,
        count,
      };
    } catch (error) {
      this.logger.error('Error in query', error);
      throw error;
    }
  }

  async create(payload: Prisma.ChainCreateInput): Promise<Chain> {
    try {
      return await this.prismaService.chain.create({
        data: {
          ...payload,
          id: generateCustomId('chn'),
        },
      });
    } catch (error) {
      this.logger.error('Error in create', error);
      throw error;
    }
  }

  async update(id: string, payload: Prisma.ChainUpdateInput): Promise<Chain> {
    try {
      return await this.prismaService.chain.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in update', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Chain> {
    try {
      return await this.prismaService.chain.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in delete', error);
      throw error;
    }
  }
}
