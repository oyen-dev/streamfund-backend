import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TopSupportService } from './topsupport.service';
import { PrismaService } from 'src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TopSupport, User } from '@prisma/client';

describe('TopSupportService', () => {
  let service: TopSupportService;
  let prisma: DeepMockProxy<PrismaService>;

  let streamer: User;
  let viewer: User;
  let topSupport: TopSupport;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopSupportService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<TopSupportService>(TopSupportService);
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
    topSupport = {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get top support', async () => {
      prisma.topSupport.findFirst.mockResolvedValue(topSupport);
      const result = await service.get({
        streamer_id: streamer.id,
        viewer_id: viewer.id,
      });
      expect(result).toEqual(topSupport);
    });
    it('should handle get errors gracefully', async () => {
      prisma.topSupport.findFirst.mockRejectedValue(new Error('Error'));
      await expect(
        service.get({ streamer_id: '1', viewer_id: '2' }),
      ).rejects.toThrow('Error');
    });
  });

  describe('create', () => {
    it('should create top support', async () => {
      prisma.topSupport.create.mockResolvedValue(topSupport);
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
      expect(result).toEqual(topSupport);
    });
    it('should handle create errors gracefully', async () => {
      prisma.topSupport.create.mockRejectedValue(new Error('Error'));
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
