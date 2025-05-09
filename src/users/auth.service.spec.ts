import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {

    // // Mock the UsersService to avoid database calls
    // const mockUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (name: string, email: string, password: string) => Promise.resolve({ id: '1', name, email, password }),
    // };

    // Mock the UsersService to avoid database calls
    const mockUsersService = {
      find: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: mockUsersService,
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
