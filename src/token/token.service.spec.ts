import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaClient, Token } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../prisma.service';

describe('TokenService', () => {
  let service: TokenService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<TokenService>(TokenService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as DeepMockProxy<PrismaClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };
    prisma.token.findFirst.mockResolvedValue(token);
    const result = await service.get({ id: 'token-1' });
    expect(result).toEqual(token);
  });

  it('should throw an error when getting token fails', async () => {
    prisma.token.findFirst.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.get({
        id: 'token-1',
      }),
    ).rejects.toThrow('Unexpected error');
  });

  it('should create token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };
    prisma.token.create.mockResolvedValue(token);
    const result = await service.create({
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      symbol: 'test',
      coin_gecko_id: 'test',
    });
    expect(result).toEqual(token);
  });

  it('should throw an error when creating token fails', async () => {
    prisma.token.create.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.create({
        address: '0x123',
        chain: 1,
        decimal: 18,
        name: 'test',
        image: 'test.png',
        symbol: 'test',
        coin_gecko_id: 'test',
      }),
    ).rejects.toThrow('Unexpected error');
  });

  it('should query token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.$transaction.mockResolvedValue([[token], 1]);
    const result = await service.query({ limit: 10, page: 1, q: 'test' });
    expect(result).toEqual({ tokens: [token], count: 1 });
  });

  it('should query token only with specific chain id', async () => {
    const tokenB: Token = {
      address: '0x456',
      chain: 2,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-2',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.$transaction.mockResolvedValue([[tokenB], 1]);
    const result = await service.query(
      {
        limit: 10,
        page: 1,
        q: 'test',
      },
      {
        chain: 2,
      },
    );
    expect(result).toEqual({ tokens: [tokenB], count: 1 });
  });

  it('should throw an error when querying token fails', async () => {
    prisma.$transaction.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.query({
        limit: 10,
        page: 1,
        q: 'test',
      }),
    ).rejects.toThrow('Unexpected error');
  });

  it('should delete token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.token.update.mockResolvedValue(token);
    const result = await service.delete(token.id);
    expect(result).toEqual(token);
  });

  it('should throw an error when deleting token fails', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.token.update.mockRejectedValue(new Error('Unexpected error'));

    await expect(service.delete(token.id)).rejects.toThrow('Unexpected error');
  });

  it('should update token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.token.update.mockResolvedValue(token);
    const result = await service.update(token.id, {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      symbol: 'test',
      coin_gecko_id: 'test',
    });
    expect(result).toEqual(token);
  });

  it('should throw an error when updating token fails', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: 'test',
      symbol: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted_at: null,
    };

    prisma.token.update.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.update(token.id, {
        address: '0x123',
        chain: 1,
        decimal: 18,
        name: 'test',
        image: 'test.png',
        symbol: 'test',
        coin_gecko_id: 'test',
      }),
    ).rejects.toThrow('Unexpected error');
  });
});
