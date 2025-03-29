import { Test, TestingModule } from '@nestjs/testing';
import { FeeCollectorService } from './feecollector.service';
import { PrismaService } from 'src/prisma.service';
import { Logger } from '@nestjs/common';
import { Chain, FeeCollector } from '@prisma/client';
import { QueryFeeCollectorResultDTO } from './dto/feecollector.dto';

describe('FeeCollectorService', () => {
  let service: FeeCollectorService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeeCollectorService,
        {
          provide: PrismaService,
          useValue: {
            feeCollector: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeeCollectorService>(FeeCollectorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a fee collector', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Chain 1',
        block_explorer_url: 'https://block.explorer',
        chain_id: 1,
        created_at: new Date(),
        deleted_at: null,
        image: 'https://image.com',
        updated_at: new Date(),
      };
      const mockFeeCollector: FeeCollector = {
        id: '1',
        address: '0x123',
        chain_id: mockChain.id,
        created_at: new Date(),
        deleted_at: null,
        updated_at: new Date(),
        usd_total: 0,
      };
      jest
        .spyOn(prismaService.feeCollector, 'findFirst')
        .mockResolvedValue(mockFeeCollector);

      const result = await service.get({ id: '1' });
      expect(result).toEqual(mockFeeCollector);
    });

    it('should handle error', async () => {
      jest
        .spyOn(prismaService.feeCollector, 'findFirst')
        .mockRejectedValue(new Error('Error'));

      await expect(service.get({ id: '1' })).rejects.toThrow('Error');
    });
  });

  describe('query', () => {
    it('should return a list of fee collectors and count', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Chain 1',
        block_explorer_url: 'https://block.explorer',
        chain_id: 1,
        created_at: new Date(),
        deleted_at: null,
        image: 'https://image.com',
        updated_at: new Date(),
      };
      const mockFeeCollector: FeeCollector = {
        id: '1',
        address: '0x123',
        chain_id: mockChain.id,
        created_at: new Date(),
        deleted_at: null,
        updated_at: new Date(),
        usd_total: 0,
      };
      const mockResults: QueryFeeCollectorResultDTO = {
        collectors: [mockFeeCollector],
        count: 1,
      };
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockResults.collectors, mockResults.count]);

      const result = await service.query({ limit: 10, page: 1, q: '' });
      expect(result).toEqual({
        collectors: [mockFeeCollector],
        count: 1,
      });
    });

    it('should handle error', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValue(new Error('Error'));

      await expect(
        service.query({ limit: 10, page: 1, q: '' }),
      ).rejects.toThrow('Error');
    });

    it('should return empty collectors and count when no data matches', async () => {
      jest.spyOn(prismaService, '$transaction').mockResolvedValue([[], 0]);

      const result = await service.query({
        limit: 10,
        page: 1,
        q: 'nonexistent',
      });
      expect(result).toEqual({ collectors: [], count: 0 });
    });

    it('should apply optional filters correctly', async () => {
      const mockCollectors = [{ id: '1', address: 'filtered' }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockCollectors, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: '' },
        { chain: { id: '1' } },
      );
      expect(result).toEqual({ collectors: mockCollectors, count: 1 });
    });

    it('should handle invalid input gracefully', async () => {
      await expect(
        service.query({ limit: -1, page: 0, q: '' }),
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new fee collector', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Chain 1',
        block_explorer_url: 'https://block.explorer',
        chain_id: 1,
        created_at: new Date(),
        deleted_at: null,
        image: 'https://image.com',
        updated_at: new Date(),
      };
      const mockFeeCollector: FeeCollector = {
        id: '1',
        address: '0x123',
        chain_id: mockChain.id,
        created_at: new Date(),
        deleted_at: null,
        updated_at: new Date(),
        usd_total: 0,
      };
      jest
        .spyOn(prismaService.feeCollector, 'create')
        .mockResolvedValue(mockFeeCollector);

      const result = await service.create({
        address: '0x123',
        chain: {
          connect: {
            id: mockChain.id,
          },
        },
        usd_total: 0,
      });
      expect(result).toEqual(mockFeeCollector);
    });

    it('should handle error', async () => {
      jest
        .spyOn(prismaService.feeCollector, 'create')
        .mockRejectedValue(new Error('Error'));

      await expect(
        service.create({
          address: '0x123',
          chain: {
            connect: {
              id: '1',
            },
          },
          usd_total: 0,
        }),
      ).rejects.toThrow('Error');
    });
  });

  describe('delete', () => {
    it('should mark a fee collector as deleted', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Chain 1',
        block_explorer_url: 'https://block.explorer',
        chain_id: 1,
        created_at: new Date(),
        deleted_at: null,
        image: 'https://image.com',
        updated_at: new Date(),
      };
      const mockFeeCollector: FeeCollector = {
        id: '1',
        address: '0x123',
        chain_id: mockChain.id,
        created_at: new Date(),
        deleted_at: null,
        updated_at: new Date(),
        usd_total: 0,
      };
      jest
        .spyOn(prismaService.feeCollector, 'update')
        .mockResolvedValue(mockFeeCollector);

      const result = await service.delete('1');
      expect(result).toEqual(mockFeeCollector);
    });

    it('should handle error', async () => {
      jest
        .spyOn(prismaService.feeCollector, 'update')
        .mockRejectedValue(new Error('Error'));

      await expect(service.delete('1')).rejects.toThrow('Error');
    });
  });

  describe('update', () => {
    it('should update a fee collector', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Chain 1',
        block_explorer_url: 'https://block.explorer',
        chain_id: 1,
        created_at: new Date(),
        deleted_at: null,
        image: 'https://image.com',
        updated_at: new Date(),
      };
      const mockFeeCollector: FeeCollector = {
        id: '1',
        address: '0x123',
        chain_id: mockChain.id,
        created_at: new Date(),
        deleted_at: null,
        updated_at: new Date(),
        usd_total: 0,
      };
      jest
        .spyOn(prismaService.feeCollector, 'update')
        .mockResolvedValue(mockFeeCollector);

      const result = await service.update('1', { address: 'updated' });
      expect(result).toEqual(mockFeeCollector);
    });

    it('should handle error', async () => {
      jest
        .spyOn(prismaService.feeCollector, 'update')
        .mockRejectedValue(new Error('Error'));

      await expect(service.update('1', { address: 'updated' })).rejects.toThrow(
        'Error',
      );
    });
  });
});
