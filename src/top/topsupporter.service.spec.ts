import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TopSupporterService } from './topsupporter.service';
import { PrismaService } from 'src/prisma.service';
import { TopSupporter, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe('TopSupporterService', () => {
  let service: TopSupporterService;
  let prisma: DeepMockProxy<PrismaService>;

  let streamer: User;
  let viewer: User;
  let topSupporter: TopSupporter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopSupporterService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<TopSupporterService>(TopSupporterService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as DeepMockProxy<PrismaService>;

    streamer = {
      id: '1',
      address: '0x123',
      stream_key: 'key123',
      usd_total_given: 0,
      usd_total_receive: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    viewer = {
      id: '1',
      address: '0x123',
      stream_key: 'key123',
      usd_total_given: 0,
      usd_total_receive: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    topSupporter = {
      id: '1',
      count: 3,
      value: 100,
      streamer_id: streamer.id,
      viewer_id: viewer.id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
  });

  describe('get', () => {
    it('should return top supporters for a streamer', async () => {
      const topSupporter = {
        id: '1',
        count: 3,
        value: 100,
        streamer_id: streamer.id,
        viewer_id: viewer.id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      prisma.topSupporter.findFirst.mockResolvedValue(topSupporter);
      const result = await service.get({ streamer_id: streamer.id });
      expect(result).toEqual(topSupporter);
    });
    it('should return null if no streamer found', async () => {
      prisma.topSupporter.findFirst.mockResolvedValue(null);
      const result = await service.get({ streamer_id: streamer.id });
      expect(result).toBeNull();
    });
    it('should handle errors gracefully', async () => {
      prisma.topSupporter.findFirst.mockRejectedValue(new Error('Error'));
      await expect(service.get({ streamer_id: streamer.id })).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('create', () => {
    it('should create a new top supporter', async () => {
      prisma.topSupporter.create.mockResolvedValue(topSupporter);
      const result = await service.create({
        id: '1',
        count: 3,
        streamer: {
          connect: {
            id: streamer.id,
          },
        },
        viewer: {
          connect: {
            id: viewer.id,
          },
        },
        value: 100,
      });
      expect(result).toEqual(topSupporter);
    });

    it('should handle errors gracefully', async () => {
      prisma.topSupporter.create.mockRejectedValue(new Error('Error'));
      await expect(
        service.create({
          id: '1',
          count: 3,
          streamer: {
            connect: {
              id: streamer.id,
            },
          },
          viewer: {
            connect: {
              id: viewer.id,
            },
          },
          value: 100,
        }),
      ).rejects.toThrow('Error');
    });
  });
});
