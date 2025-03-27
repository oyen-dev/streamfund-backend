import { Test, TestingModule } from '@nestjs/testing';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';
import { GetStreamerResultDTO } from './dto/streamer.dto';
import { HttpStatus } from '@nestjs/common';

describe('StreamerController', () => {
  let controller: StreamerController;
  let service: StreamerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamerController],
      providers: [
        {
          provide: StreamerService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StreamerController>(StreamerController);
    service = module.get<StreamerService>(StreamerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get streamer', async () => {
      const streamer: Partial<GetStreamerResultDTO> = {
        address: '0x74Bf296288eB66F6837536b579945481841a171C',
        usd_total_support: 12.17855,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest
        .spyOn(service, 'get')
        .mockResolvedValue(streamer as GetStreamerResultDTO);

      const result = await controller.get(
        '0x74Bf296288eB66F6837536b579945481841a171C',
      );
      expect(result).toEqual({
        success: true,
        message: 'Streamer fetched successfully',
        data: {
          streamer,
        },
        status_code: HttpStatus.OK,
      });
    });

    it('should throw not found exception', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(null);

      await expect(
        controller.get('0x74Bf296288eB66F6837536b579945481841a171C'),
      ).rejects.toThrow('Streamer not found');
    });
  });
});
