import { Test, TestingModule } from '@nestjs/testing';
import { ViewerService } from './viewer.service';
import { PrismaService } from '../prisma.service';
import { Viewer } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ViewerService', () => {
  let service: ViewerService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewerService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<ViewerService>(ViewerService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a viewer', async () => {
      const mockViewer: Viewer = {
        id: 'vwr_123',
        address: '0x123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_support: 100,
      };

      prismaService.viewer.findFirst.mockResolvedValue(mockViewer);

      const result = await service.get({ id: 'vwr_123' });
      expect(result).toEqual(mockViewer);
    });

    it('should throw an error if prisma fails', async () => {
      const error = new Error('Database error');
      prismaService.viewer.findFirst.mockRejectedValue(error);

      await expect(service.get({ id: 'vwr_123' })).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('should create a new viewer', async () => {
      const mockViewer: Viewer = {
        id: 'vwr_123',
        address: '0x123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_support: 100,
      };

      prismaService.viewer.create.mockResolvedValue(mockViewer);

      const result = await service.create({
        address: '0x123',
        usd_total_support: 100,
      });
      expect(result).toEqual(mockViewer);
      expect(result.id).toMatch(/^vwr_/);
    });

    it('should throw an error if prisma fails', async () => {
      const error = new Error('Database error');
      prismaService.viewer.create.mockRejectedValue(error);

      await expect(
        service.create({
          address: '0x123',
          usd_total_support: 100,
        }),
      ).rejects.toThrow(error);
    });
  });
});
