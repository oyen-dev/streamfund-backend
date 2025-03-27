import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma.service';
import { Chain, Token } from '@prisma/client';

describe('TokenService', () => {
  let service: TokenService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: {
            token: {
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

    service = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a token', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        chain_id: 1,
        block_explorer_url: 'test.com',
        image: 'test.png',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      const mockToken: Token = {
        id: '1',
        name: 'Test Token',
        address: '0x123',
        symbol: 'TT',
        coin_gecko_id: 'test',
        decimal: 18,
        image: 'test.png',
        chain_id: mockChain.id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      jest.spyOn(prismaService.token, 'findFirst').mockResolvedValue(mockToken);

      const result = await service.get({ id: '1' });
      expect(result).toEqual(mockToken);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.token, 'findFirst')
        .mockRejectedValue(new Error('Error'));
      await expect(service.get({ id: '1' })).rejects.toThrow('Error');
    });
  });

  describe('query', () => {
    it('should return tokens and count', async () => {
      const mockTokens = [{ id: '1', name: 'Test Token' }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockTokens, 1]);

      const query = { limit: 10, page: 1, q: '' };
      const result = await service.query(query);
      expect(result).toEqual({ tokens: mockTokens, count: 1 });
    });

    it('should filter tokens by chain_id', async () => {
      const mockTokens = [{ id: '1', name: 'Filtered Token', chain_id: 2 }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockTokens, 1]);

      const query = { limit: 10, page: 1, q: '' };
      const result = await service.query(query, { chain_id: '2' });
      expect(result).toEqual({ tokens: mockTokens, count: 1 });
    });

    it('should search tokens by query string', async () => {
      const mockTokens = [{ id: '1', name: 'Test Token' }];
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([mockTokens, 1]);

      const query = { limit: 10, page: 1, q: 'Test' };
      const result = await service.query(query);
      expect(result).toEqual({ tokens: mockTokens, count: 1 });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValue(new Error('Error'));
      const query = { limit: 10, page: 1, q: '' };
      await expect(service.query(query)).rejects.toThrow('Error');
    });
  });

  describe('create', () => {
    it('should create a token', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        chain_id: 1,
        block_explorer_url: 'test.com',
        image: 'test.png',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      const mockToken: Token = {
        id: '1',
        name: 'Test Token',
        address: '0x123',
        symbol: 'TT',
        coin_gecko_id: 'test',
        decimal: 18,
        image: 'test.png',
        chain_id: mockChain.id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      jest.spyOn(prismaService.token, 'create').mockResolvedValue(mockToken);

      const result = await service.create({
        address: '0x123',
        coin_gecko_id: 'test',
        decimal: 18,
        image: 'test.png',
        name: 'Test Token',
        symbol: 'TT',
        chain: {
          connect: {
            id: mockChain.id,
          },
        },
      });
      expect(result).toEqual(mockToken);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.token, 'create')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.create({
          address: '0x123',
          coin_gecko_id: 'test',
          decimal: 18,
          image: 'test.png',
          name: 'Test Token',
          symbol: 'TT',
          chain: {
            connect: {
              id: '1',
            },
          },
        }),
      ).rejects.toThrow('Error');
    });
  });

  describe('update', () => {
    it('should update a token', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        chain_id: 1,
        block_explorer_url: 'test.com',
        image: 'test.png',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      const mockToken: Token = {
        id: '1',
        name: 'Test Token',
        address: '0x123',
        symbol: 'TT',
        coin_gecko_id: 'test',
        decimal: 18,
        image: 'test.png',
        chain_id: mockChain.id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      jest.spyOn(prismaService.token, 'update').mockResolvedValue(mockToken);

      const payload = { name: 'Updated Token' };
      const result = await service.update('1', payload);
      expect(result).toEqual(mockToken);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.token, 'update')
        .mockRejectedValue(new Error('Error'));
      const payload = { name: 'Updated Token' };
      await expect(service.update('1', payload)).rejects.toThrow('Error');
    });
  });

  describe('delete', () => {
    it('should soft delete a token', async () => {
      const mockChain: Chain = {
        id: '1',
        name: 'Test Chain',
        chain_id: 1,
        block_explorer_url: 'test.com',
        image: 'test.png',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      const mockToken: Token = {
        id: '1',
        name: 'Test Token',
        address: '0x123',
        symbol: 'TT',
        coin_gecko_id: 'test',
        decimal: 18,
        image: 'test.png',
        chain_id: mockChain.id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
      jest.spyOn(prismaService.token, 'update').mockResolvedValue(mockToken);

      const result = await service.delete('1');
      expect(result).toEqual(mockToken);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(prismaService.token, 'update')
        .mockRejectedValue(new Error('Error'));
      await expect(service.delete('1')).rejects.toThrow('Error');
    });
  });
});
