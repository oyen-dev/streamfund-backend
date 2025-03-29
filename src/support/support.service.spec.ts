import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from './support.service';
import { PrismaService } from 'src/prisma.service';
import {
  Chain,
  FeeCollector,
  Streamer,
  Support,
  Token,
  TopSupport,
  Viewer,
} from '@prisma/client';
import { CreateSupportDTO } from './dto/support.dto';
import { STREAMFUND_FEES } from 'src/utils/constant';

describe('SupportService', () => {
  let service: SupportService;

  const mockPrismaService = {
    support: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    feeCollector: {
      update: jest.fn(),
    },
    viewer: {
      update: jest.fn(),
    },
    streamer: {
      update: jest.fn(),
    },
    topSupport: {
      create: jest.fn(),
      update: jest.fn(),
    },
    topSupporter: {
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitSupport', () => {
    const mockPayload: CreateSupportDTO = {
      data: 'test data',
      hash: 'test hash',
      usd_amount: 100,
      token_amount: 50,
      collector_id: 'collector1',
      viewer_id: 'viewer1',
      streamer_id: 'streamer1',
      token_id: 'token1',
      top_support_id: 'topSupport1',
      top_supporter_id: 'topSupporter1',
    };

    const mockSupport: Support = {
      id: 'spt_test',
      data: mockPayload.data,
      hash: mockPayload.hash,
      usd_amount: mockPayload.usd_amount,
      token_amount: BigInt(mockPayload.token_amount),
      from_id: mockPayload.viewer_id,
      to_id: mockPayload.streamer_id,
      token_id: mockPayload.token_id,
      fee_collector_id: mockPayload.collector_id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should successfully submit support', async () => {
      mockPrismaService.$transaction.mockResolvedValue([mockSupport]);

      const result = await service.submitSupport(mockPayload);

      expect(result).toEqual(mockSupport);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      const feeShared = (mockPayload.usd_amount * STREAMFUND_FEES) / 10_000;
      expect(mockPrismaService.feeCollector.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { usd_total: { increment: feeShared } },
        }),
      );
    });

    it('should throw error when transaction fails', async () => {
      const error = new Error('Transaction failed');
      mockPrismaService.$transaction.mockRejectedValue(error);

      await expect(service.submitSupport(mockPayload)).rejects.toThrow(error);
    });
  });

  describe('createTopSupport', () => {
    const mockTopSupport: TopSupport = {
      id: 'spt_test',
      count: 0,
      value: 0,
      streamer_id: 'streamer1',
      viewer_id: 'viewer1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should create top support successfully', async () => {
      mockPrismaService.topSupport.create.mockResolvedValue(mockTopSupport);

      const result = await service.createTopSupport('streamer1', 'viewer1');

      expect(result).toEqual(mockTopSupport);
      expect(mockPrismaService.topSupport.create).toHaveBeenCalled();
    });

    it('should throw an error if top support creation fails', async () => {
      const error = new Error('Creation failed');
      mockPrismaService.topSupport.create.mockRejectedValue(error);

      await expect(
        service.createTopSupport('streamer1', 'viewer1'),
      ).rejects.toThrow(error);
      expect(mockPrismaService.topSupport.create).toHaveBeenCalled();
    });
  });

  describe('createTopSupporter', () => {
    const mockTopSupporter: TopSupport = {
      id: 'tsr_test',
      count: 0,
      value: 0,
      streamer_id: 'streamer1',
      viewer_id: 'viewer1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should create top supporter successfully', async () => {
      mockPrismaService.topSupporter.create.mockResolvedValue(mockTopSupporter);

      const result = await service.createTopSupporter('streamer1', 'viewer1');

      expect(result).toEqual(mockTopSupporter);
      expect(mockPrismaService.topSupporter.create).toHaveBeenCalled();
    });

    it('should throw an error if top supporter creation fails', async () => {
      const error = new Error('Creation failed');
      mockPrismaService.topSupporter.create.mockRejectedValue(error);

      await expect(
        service.createTopSupporter('streamer1', 'viewer1'),
      ).rejects.toThrow(error);
      expect(mockPrismaService.topSupporter.create).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    const mockSupport: Support = {
      id: 'spt_test',
      data: 'test',
      hash: 'hash',
      usd_amount: 100,
      token_amount: BigInt(50),
      from_id: 'viewer1',
      to_id: 'streamer1',
      token_id: 'token1',
      fee_collector_id: 'collector1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should get support by where condition', async () => {
      mockPrismaService.support.findFirst.mockResolvedValue(mockSupport);

      const result = await service.get({ id: 'spt_test' });

      expect(result).toEqual(mockSupport);
      expect(mockPrismaService.support.findFirst).toHaveBeenCalled();
    });

    it('should handle get errors gracefully', async () => {
      const error = new Error('Get failed');
      mockPrismaService.support.findFirst.mockRejectedValue(error);

      await expect(service.get({ id: 'spt_test' })).rejects.toThrow(error);
    });
  });

  describe('query', () => {
    const mockSupports = [
      {
        id: 'spt_test1',
        data: 'test1',
        hash: 'hash1',
        usd_amount: 100,
        token_amount: 50,
        from_id: 'viewer1',
        to_id: 'streamer1',
        token_id: 'token1',
        fee_collector_id: 'collector1',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    it('should query supports with pagination', async () => {
      mockPrismaService.$transaction.mockResolvedValue([mockSupports, 1]);

      const result = await service.query({ limit: 10, page: 1, q: 'test' });

      expect(result).toEqual({ supports: mockSupports, count: 1 });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should query supports with token_id filter', async () => {
      mockPrismaService.$transaction.mockResolvedValue([mockSupports, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: 'test' },
        { token_id: 'token1' },
      );

      expect(result).toEqual({ supports: mockSupports, count: 1 });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should query supports with from_id filter', async () => {
      mockPrismaService.$transaction.mockResolvedValue([mockSupports, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: 'test' },
        { from_id: 'viewer1' },
      );

      expect(result).toEqual({ supports: mockSupports, count: 1 });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should query supports with to_id filter', async () => {
      mockPrismaService.$transaction.mockResolvedValue([mockSupports, 1]);

      const result = await service.query(
        { limit: 10, page: 1, q: 'test' },
        { to_id: 'streamer1' },
      );

      expect(result).toEqual({ supports: mockSupports, count: 1 });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should handle query errors gracefully', async () => {
      const error = new Error('Query failed');
      mockPrismaService.$transaction.mockRejectedValue(error);

      await expect(
        service.query({ limit: 10, page: 1, q: 'test' }),
      ).rejects.toThrow(error);
    });
  });

  describe('create', () => {
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
    const mockToken: Token = {
      id: '1',
      chain_id: mockChain.id,
      created_at: new Date(),
      deleted_at: null,
      image: 'https://image.com',
      name: 'Token 1',
      symbol: 'TKN1',
      updated_at: new Date(),
      address: '0x123',
      coin_gecko_id: 'coin1',
      decimal: 18,
    };
    const mockFeeCollector: FeeCollector = {
      address: '0x123',
      chain_id: mockChain.id,
      created_at: new Date(),
      deleted_at: null,
      updated_at: new Date(),
      usd_total: 0,
      id: '1',
    };
    const mockStreamer: Streamer = {
      id: '1',
      address: '0x123',
      stream_key: 'stream_key',
      usd_total_support: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    const mockViewer: Viewer = {
      address: '0x123',
      usd_total_support: 0,
      created_at: new Date(),
      deleted_at: null,
      id: '1',
      updated_at: new Date(),
    };
    const mockSupport: Support = {
      id: 'spt_test',
      data: 'test',
      hash: 'hash',
      usd_amount: 100,
      token_amount: BigInt(50),
      from_id: 'viewer1',
      to_id: 'streamer1',
      token_id: 'token1',
      fee_collector_id: 'collector1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should create support successfully', async () => {
      mockPrismaService.support.create.mockResolvedValue(mockSupport);

      const result = await service.create({
        data: 'test',
        hash: 'hash',
        usd_amount: 100,
        token_amount: BigInt(50),
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        id: 'spt_test',
        from: {
          connect: {
            id: mockViewer.id,
          },
        },
        to: {
          connect: {
            id: mockStreamer.id,
          },
        },
        fee_collector: {
          connect: {
            id: mockFeeCollector.id,
          },
        },
        token: {
          connect: {
            id: mockToken.id,
          },
        },
      });

      expect(result).toEqual(mockSupport);
      expect(mockPrismaService.support.create).toHaveBeenCalled();
    });

    it('should handle create errors gracefully', async () => {
      const error = new Error('Create failed');
      mockPrismaService.support.create.mockRejectedValue(error);

      await expect(
        service.create({
          data: 'test',
          hash: 'hash',
          usd_amount: 100,
          token_amount: BigInt(50),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          id: 'spt_test',
          from: {
            connect: {
              id: mockViewer.id,
            },
          },
          to: {
            connect: {
              id: mockStreamer.id,
            },
          },
          fee_collector: {
            connect: {
              id: mockFeeCollector.id,
            },
          },
          token: {
            connect: {
              id: mockToken.id,
            },
          },
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('delete', () => {
    const mockSupport: Support = {
      id: 'spt_test',
      data: 'test',
      hash: 'hash',
      usd_amount: 100,
      token_amount: BigInt(50),
      from_id: 'viewer1',
      to_id: 'streamer1',
      token_id: 'token1',
      fee_collector_id: 'collector1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
    };

    it('should soft delete support successfully', async () => {
      mockPrismaService.support.update.mockResolvedValue(mockSupport);

      const result = await service.delete('spt_test');

      expect(result).toEqual(mockSupport);
      expect(mockPrismaService.support.update).toHaveBeenCalled();
    });

    it('should handle delete errors gracefully', async () => {
      const error = new Error('Delete failed');
      mockPrismaService.support.update.mockRejectedValue(error);

      await expect(service.delete('spt_test')).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const mockSupport: Support = {
      id: 'spt_test',
      data: 'updated test',
      hash: 'hash',
      usd_amount: 100,
      token_amount: BigInt(50),
      from_id: 'viewer1',
      to_id: 'streamer1',
      token_id: 'token1',
      fee_collector_id: 'collector1',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should update support successfully', async () => {
      mockPrismaService.support.update.mockResolvedValue(mockSupport);

      const result = await service.update('spt_test', { data: 'updated test' });

      expect(result).toEqual(mockSupport);
      expect(mockPrismaService.support.update).toHaveBeenCalled();
    });

    it('should handle update errors gracefully', async () => {
      const error = new Error('Update failed');
      mockPrismaService.support.update.mockRejectedValue(error);

      await expect(
        service.update('spt_test', { data: 'updated test' }),
      ).rejects.toThrow(error);
    });
  });
});
