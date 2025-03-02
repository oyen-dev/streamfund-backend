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

  it('should return a streamer by stream key', async () => {
    const streamer: Streamer = {
      id: '1',
      address: '0x',
      stream_key: 'stream_key',
      usd_total_support: 0,
    };

    prisma.streamer.findFirst.mockResolvedValue(streamer);
    expect(await service.getStreamerByStreamKey('stream_key')).toEqual(
      streamer,
    );
  });

  it('should throw an error when streamer is not found by stream key', async () => {
    prisma.streamer.findFirst.mockRejectedValue(new Error('Unexpected error'));
    await expect(
      service.getStreamerByStreamKey('stream_key'),
    ).rejects.toThrow();
  });

  it('should return a streamer by address', async () => {
    const streamer: Streamer = {
      id: '1',
      address: '0x',
      stream_key: 'stream_key',
      usd_total_support: 0,
    };

    prisma.streamer.findFirst.mockResolvedValue(streamer);
    expect(await service.getStreamerByAddress('0x')).toEqual(streamer);
  });

  it('should throw an error when streamer is not found by address', async () => {
    prisma.streamer.findFirst.mockRejectedValue(new Error('Unexpected error'));
    await expect(service.getStreamerByAddress('0x')).rejects.toThrow();
  });

  it('should return a streamer by username', async () => {
    const streamer: Streamer = {
      id: '1',
      address: '0x',
      stream_key: 'stream_key',
      usd_total_support: 0,
    };

    prisma.streamer.findFirst.mockResolvedValue(streamer);
    expect(await service.getStreamerByUsername('username')).toEqual(streamer);
  });

  it('should throw an error when streamer is not found by username', async () => {
    prisma.streamer.findFirst.mockRejectedValue(new Error('Unexpected error'));
    await expect(service.getStreamerByUsername('username')).rejects.toThrow();
  });
});
