import { Test, TestingModule } from '@nestjs/testing';
import { ChainService } from './chain.service';
import { PrismaService } from '../prisma.service';
import { Logger } from '@nestjs/common';
import { QueryChainDTO } from './dto/chain.dto';
import { Chain } from '@prisma/client';

describe('ChainService', () => {
  let service: ChainService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChainService,
        {
          provide: PrismaService,
          useValue: {
            chain: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<ChainService>(ChainService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a chain', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        block_explorer_url: 'test.com',
        chain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        image: 'test.png',
      };
      jest.spyOn(prismaService.chain, 'findFirst').mockResolvedValue(mockChain);

      const result = await service.get({ id: '1' });
      expect(result).toEqual(mockChain);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.chain, 'findFirst')
        .mockRejectedValue(new Error('Error'));
      await expect(service.get({ id: '1' })).rejects.toThrow('Error');
    });
  });

  describe('query', () => {
    it('should return chains and count', async () => {
      const mockChains = [{ id: '1', name: 'Test Chain' }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockChains, 1]);

      const query: QueryChainDTO = { limit: 10, page: 1, q: '' };
      const result = await service.query(query);
      expect(result).toEqual({ chains: mockChains, count: 1 });
    });

    it('should filter chains by chain_id', async () => {
      const mockChains = [{ id: '1', name: 'Filtered Chain', chain_id: 2 }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockChains, 1]);

      const query: QueryChainDTO = { limit: 10, page: 1, q: '' };
      const result = await service.query(query, { chain_id: 2 });
      expect(result).toEqual({ chains: mockChains, count: 1 });
    });

    it('should search chains by query string', async () => {
      const mockChains = [{ id: '1', name: 'Test Chain' }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockChains, 1]);

      const query: QueryChainDTO = { limit: 10, page: 1, q: 'Test' };
      const result = await service.query(query);
      expect(result).toEqual({ chains: mockChains, count: 1 });
    });

    it('should include collector relation in the result', async () => {
      const mockChains = [
        { id: '1', name: 'Test Chain', collector: { id: 'collector1' } },
      ];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockChains, 1]);

      const query: QueryChainDTO = { limit: 10, page: 1, q: '' };
      const result = await service.query(query);
      expect(result).toEqual({ chains: mockChains, count: 1 });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValue(new Error('Error'));
      const query: QueryChainDTO = { limit: 10, page: 1, q: '' };
      await expect(service.query(query)).rejects.toThrow('Error');
    });
  });

  describe('create', () => {
    it('should create a chain', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        block_explorer_url: 'test.com',
        chain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        image: 'test.png',
      };
      jest.spyOn(prismaService.chain, 'create').mockResolvedValue(mockChain);

      const result = await service.create({
        block_explorer_url: 'test.com',
        chain_id: 1,
        image: 'test.png',
        name: 'Test Chain',
      });
      expect(result).toEqual(mockChain);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.chain, 'create')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.create({
          block_explorer_url: 'test.com',
          chain_id: 1,
          image: 'test.png',
          name: 'Test Chain',
        }),
      ).rejects.toThrow('Error');
    });
  });

  describe('update', () => {
    it('should update a chain', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        block_explorer_url: 'test.com',
        chain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        image: 'test.png',
      };
      jest.spyOn(prismaService.chain, 'update').mockResolvedValue(mockChain);

      const result = await service.update('chn1', { name: 'Updated Chain' });
      expect(result).toEqual(mockChain);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.chain, 'update')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.update('chn1', { name: 'Updated Chain' }),
      ).rejects.toThrow('Error');
    });
  });

  describe('delete', () => {
    it('should soft delete a chain', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        block_explorer_url: 'test.com',
        chain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        image: 'test.png',
      };
      jest.spyOn(prismaService.chain, 'update').mockResolvedValue(mockChain);

      const result = await service.delete('chn1');
      expect(result).toEqual(mockChain);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.chain, 'update')
        .mockRejectedValue(new Error('Error'));
      await expect(service.delete('chn1')).rejects.toThrow('Error');
    });
  });
});
