import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get user', async () => {
      const user = {
        id: 'str-h54tqx0hgv7lxb7vneutg9xm4',
        address: '0x74Bf296288eB66F6837536b579945481841a171C',
        stream_key: 'str-h54tqx0hgv7lxb7vneutg9xm4',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        usd_total_receive: 0,
        usd_total_given: 0,
        configuration: null,
        bio: null,
      };

      jest.spyOn(service, 'get').mockResolvedValue(user);

      const result = await controller.get(
        '0x74Bf296288eB66F6837536b579945481841a171C',
      );
      expect(result).toEqual({
        success: true,
        message: 'User fetched successfully',
        data: {
          user,
        },
        status_code: HttpStatus.OK,
      });
    });

    it('should throw not found exception', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(null);

      await expect(
        controller.get('0x74Bf296288eB66F6837536b579945481841a171C'),
      ).rejects.toThrow('User not found');
    });
  });
});
