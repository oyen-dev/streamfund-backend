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

  it('should create token', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: null,
      symbol: 'test',
    };
    prisma.token.create.mockResolvedValue(token);

    const result = await service.createToken({
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      symbol: 'test',
    });
    expect(result).toEqual(token);
  });

  it('should throw an error when creating token fails', async () => {
    prisma.token.create.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.createToken({
        address: '0x123',
        chain: 1,
        decimal: 18,
        name: 'test',
        image: 'test.png',
        symbol: 'test',
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
      coin_gecko_id: null,
      symbol: 'test',
    };

    prisma.$transaction.mockResolvedValue([[token], 1]);
    const result = await service.queryToken({ limit: 10, page: 1, q: 'test' });
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
      coin_gecko_id: null,
      symbol: 'test',
    };

    prisma.$transaction.mockResolvedValue([[tokenB], 1]);
    const result = await service.queryToken({
      limit: 10,
      page: 1,
      q: 'test',
      chain: 2,
    });
    expect(result).toEqual({ tokens: [tokenB], count: 1 });
  });

  it('should throw an error when querying token fails', async () => {
    prisma.$transaction.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.queryToken({
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
      coin_gecko_id: null,
      symbol: 'test',
    };

    prisma.token.findFirst.mockResolvedValue(token);
    prisma.token.delete.mockResolvedValue(token);
    const result = await service.deleteToken(token.address, token.chain);
    expect(result).toEqual(token);
  });

  it('should failed to delete token when token not found', async () => {
    prisma.token.findFirst.mockResolvedValue(null);

    await expect(service.deleteToken('0x123', 1)).rejects.toThrow(
      'Token not found',
    );
  });

  it('should throw an error when deleting token fails', async () => {
    const token: Token = {
      address: '0x123',
      chain: 1,
      decimal: 18,
      name: 'test',
      image: 'test.png',
      id: 'token-1',
      coin_gecko_id: null,
      symbol: 'test',
    };

    prisma.token.findFirst.mockResolvedValue(token);
    prisma.token.delete.mockRejectedValue(new Error('Unexpected error'));

    await expect(
      service.deleteToken(token.address, token.chain),
    ).rejects.toThrow('Unexpected error');
  });

  it('should throw an error when get token by address and chain fails', async () => {
    prisma.token.findFirst.mockRejectedValue(new Error('Unexpected error'));

    await expect(service.getTokenByAddressAndChain('0x123', 1)).rejects.toThrow(
      'Unexpected error',
    );
  });
});
