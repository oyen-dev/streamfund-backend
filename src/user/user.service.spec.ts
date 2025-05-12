import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get a user by address', async () => {
      const user: User = {
        id: '1',
        address: '0x123',
        stream_key: 'key123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_given: 0,
        usd_total_receive: 0,
      };

      prisma.user.findFirst.mockResolvedValue(user);
      const result = await service.get({ address: '0x123' });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const result = await service.get({ address: 'nonexistent' });
      expect(result).toBeNull();
    });

    it('should throw error when query fails', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('Query failed'));
      await expect(service.get({ address: '0x123' })).rejects.toThrow(
        'Query failed',
      );
    });
  });

  describe('query', () => {
    it('should query users with pagination', async () => {
      const users: User[] = [
        {
          id: '1',
          address: '0x123',
          stream_key: 'key123',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          usd_total_given: 0,
          usd_total_receive: 0,
        },
      ];

      prisma.$transaction.mockResolvedValue([users, 1]);

      const result = await service.query({ limit: 10, page: 1, q: '' });
      expect(result).toEqual({ users, count: 1 });
    });

    it('should query user with bio username filter', async () => {
      const users: User[] = [
        {
          id: '1',
          address: '0x123',
          stream_key: 'key123',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          usd_total_given: 0,
          usd_total_receive: 0,
        },
      ];

      prisma.$transaction.mockResolvedValue([users, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: '' },
        { bio: { username: 'testuser' } },
      );
      expect(result).toEqual({ users, count: 1 });
    });

    it('should throw error when query fails', async () => {
      prisma.$transaction.mockRejectedValue(new Error('Query failed'));
      await expect(
        service.query({ limit: 10, page: 1, q: '' }),
      ).rejects.toThrow('Query failed');
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      const user: User = {
        id: '1',
        address: '0x123',
        stream_key: 'key123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        usd_total_given: 0,
        usd_total_receive: 0,
      };

      prisma.user.update.mockResolvedValue(user);
      const result = await service.delete('1');
      expect(result.deleted_at).toBeDefined();
    });

    it('should throw error when deleting non-existent user', async () => {
      prisma.user.update.mockRejectedValue(new Error('User not found'));
      await expect(service.delete('999')).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update streamer details', async () => {
      const user: User = {
        id: '1',
        address: '0x123',
        stream_key: 'new_key',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_given: 200,
        usd_total_receive: 100,
      };

      prisma.user.update.mockResolvedValue(user);

      const result = await service.update('1', {
        stream_key: 'new_key',
        usd_total_given: 200,
        usd_total_receive: 100,
      });

      expect(result).toEqual(user);
      expect(result.stream_key).toBe('new_key');
      expect(result.usd_total_given).toBe(200);
      expect(result.usd_total_receive).toBe(100);
    });

    it('should throw error when updating non-existent user', async () => {
      prisma.user.update.mockRejectedValue(new Error('User not found'));
      await expect(
        service.update('999', { stream_key: 'new_key' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: User = {
        id: '1',
        address: '0x',
        stream_key: 'stream_key',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_given: 0,
        usd_total_receive: 0,
      };

      prisma.user.create.mockResolvedValue(user);
      expect(
        await service.create({
          address: '0x',
          stream_key: 'stream_key',
          usd_total_given: 0,
          usd_total_receive: 0,
        }),
      ).toEqual(user);
    });

    it('should throw error when creating user fails', async () => {
      prisma.user.create.mockRejectedValue(new Error('Creation failed'));
      await expect(
        service.create({
          address: '0x',
          stream_key: 'stream_key',
          usd_total_given: 0,
          usd_total_receive: 0,
        }),
      ).rejects.toThrow('Creation failed');
    });
  });
});
