import { Test, TestingModule } from '@nestjs/testing';
import { StreamerService } from './streamer.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Streamer } from '@prisma/client';

describe('StreamerService', () => {
  let service: StreamerService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamerService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<StreamerService>(StreamerService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a streamer', async () => {
    const streamer: Streamer = {
      id: '1',
      address: '0x',
      stream_key: 'stream_key',
      usd_total_support: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prisma.streamer.create.mockResolvedValue(streamer);
    expect(
      await service.create({
        address: '0x',
        stream_key: 'stream_key',
        usd_total_support: 0,
      }),
    ).toEqual(streamer);
  });
});
