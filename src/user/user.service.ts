import { Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { generateCustomId } from 'src/utils/utils';
import {
  GetUserResultDTO,
  QueryUserDTO,
  QueryUserResultDTO,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(UserService.name);

  async get(payload: Prisma.UserWhereInput): Promise<GetUserResultDTO | null> {
    try {
      return await this.prismaService.user.findFirst({
        where: payload,
        include: {
          bio: true,
          configuration: true,
        },
      });
    } catch (error) {
      this.logger.error('Error in getUser', error);
      throw error;
    }
  }

  async query(
    query: QueryUserDTO,
    opt?: Prisma.UserWhereInput,
  ): Promise<QueryUserResultDTO> {
    try {
      const { limit, page, q } = query;
      const whereQuery: Prisma.UserWhereInput = {
        OR: [
          {
            address: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
        deleted_at: null,
      };

      if (opt) {
        if (opt.bio?.username) {
          whereQuery.bio = {
            username: opt.bio.username,
          };
        }
      }

      const [users, count] = await this.prismaService.$transaction([
        this.prismaService.user.findMany({
          where: whereQuery,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            usd_total_receive: 'desc',
          },
          include: {
            bio: true,
            configuration: true,
          },
        }),
        this.prismaService.user.count({
          where: whereQuery,
        }),
      ]);

      return {
        users,
        count,
      };
    } catch (error) {
      this.logger.error('Error in queryUser', error);
      throw error;
    }
  }

  async create(paylod: Prisma.UserCreateInput): Promise<GetUserResultDTO> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...paylod,
          id: generateCustomId('usr'),
          stream_key: generateCustomId('SK'),
        },
        include: {
          bio: true,
          configuration: true,
        },
      });
    } catch (error) {
      this.logger.error('Error in createUser', error);
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error in deleteUser', error);
      throw error;
    }
  }

  async update(id: string, payload: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: {
          id,
        },
        data: payload,
      });
    } catch (error) {
      this.logger.error('Error in updateUser', error);
      throw error;
    }
  }
}
