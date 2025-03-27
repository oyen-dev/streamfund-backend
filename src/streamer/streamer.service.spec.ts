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

  describe('get', () => {
    it('should get a streamer by address', async () => {
      const streamer = {
        id: '1',
        address: '0x123',
        stream_key: 'key123',
        usd_total_support: 100,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        bio: null,
        configuration: null,
      };

      prisma.streamer.findFirst.mockResolvedValue(streamer);
      const result = await service.get({ address: '0x123' });
      expect(result).toEqual(streamer);
    });

    it('should return null when streamer not found', async () => {
      prisma.streamer.findFirst.mockResolvedValue(null);
      const result = await service.get({ address: 'nonexistent' });
      expect(result).toBeNull();
    });

    it('should throw error when query fails', async () => {
      prisma.streamer.findFirst.mockRejectedValue(new Error('Query failed'));
      await expect(service.get({ address: '0x123' })).rejects.toThrow(
        'Query failed',
      );
    });
  });

  describe('query', () => {
    it('should query streamers with pagination', async () => {
      const streamers = [
        {
          id: '1',
          address: '0x123',
          stream_key: 'key123',
          usd_total_support: 100,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          bio: null,
          configuration: null,
        },
      ];

      prisma.$transaction.mockResolvedValue([streamers, 1]);

      const result = await service.query({ limit: 10, page: 1, q: '' });
      expect(result).toEqual({ streamers, count: 1 });
    });

    it('should query streamers with bio username filter', async () => {
      const streamers = [
        {
          id: '1',
          address: '0x123',
          stream_key: 'key123',
          usd_total_support: 100,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          bio: { username: 'testuser' },
          configuration: null,
        },
      ];

      prisma.$transaction.mockResolvedValue([streamers, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: '' },
        { bio: { username: 'testuser' } },
      );
      expect(result).toEqual({ streamers, count: 1 });
    });

    it('should throw error when query fails', async () => {
      prisma.$transaction.mockRejectedValue(new Error('Query failed'));
      await expect(
        service.query({ limit: 10, page: 1, q: '' }),
      ).rejects.toThrow('Query failed');
    });
  });

  describe('delete', () => {
    it('should soft delete a streamer', async () => {
      const streamer = {
        id: '1',
        address: '0x123',
        stream_key: 'key123',
        usd_total_support: 100,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      };

      prisma.streamer.update.mockResolvedValue(streamer);
      const result = await service.delete('1');
      expect(result.deleted_at).toBeDefined();
    });

    it('should throw error when deleting non-existent streamer', async () => {
      prisma.streamer.update.mockRejectedValue(new Error('Streamer not found'));
      await expect(service.delete('999')).rejects.toThrow('Streamer not found');
    });
  });

  describe('update', () => {
    it('should update streamer details', async () => {
      const updatedStreamer = {
        id: '1',
        address: '0x123',
        stream_key: 'new_key',
        usd_total_support: 200,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.streamer.update.mockResolvedValue(updatedStreamer);

      const result = await service.update('1', {
        stream_key: 'new_key',
        usd_total_support: 200,
      });

      expect(result).toEqual(updatedStreamer);
      expect(result.stream_key).toBe('new_key');
      expect(result.usd_total_support).toBe(200);
    });

    it('should throw error when updating non-existent streamer', async () => {
      prisma.streamer.update.mockRejectedValue(new Error('Streamer not found'));
      await expect(
        service.update('999', { stream_key: 'new_key' }),
      ).rejects.toThrow('Streamer not found');
    });
  });

  describe('create', () => {
    it('should create a streamer', async () => {
      const streamer: Streamer = {
        id: '1',
        address: '0x',
        stream_key: 'stream_key',
        usd_total_support: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
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

    it('should throw error when creating streamer fails', async () => {
      prisma.streamer.create.mockRejectedValue(new Error('Creation failed'));
      await expect(
        service.create({
          address: '0x',
          stream_key: 'stream_key',
          usd_total_support: 0,
        }),
      ).rejects.toThrow('Creation failed');
    });
  });
});
