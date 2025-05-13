import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;
  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn((id: string) => {
        return Promise.resolve({
          id: '1',
          name: 'test',
          email: 'test@example.com',
          password: 'test',
        } as User);
      }),
      find: jest.fn((email: string) => {
        return Promise.resolve([
          {
            id: '1',
            name: 'test',
            email: 'test@example.com',
            password: 'test',
          } as User,
        ]);
      }),
      remove: jest.fn((id: string) => {
        return Promise.resolve({
          id: '1',
          name: 'test',
          email: 'test@example.com',
          password: 'test',
        } as User);
      }),
      update: jest.fn((id: string, attrs: Partial<User>) => {
        return Promise.resolve({
          id: '1',
          name: 'test',
          email: 'test@example.com',
          password: 'test',
        } as User);
      }),
    };
    mockAuthService = {
      signup: jest.fn((name: string, email: string, password: string) => {
        return Promise.resolve({ id: '1', name, email, password } as User);
      }),
      signin: jest.fn((email: string, password: string) => {
        return Promise.resolve({
          id: '1',
          name: 'test',
          email,
          password,
        } as User);
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUsersByEmail ()', () => {
    it('should return a list of users with the given email', async () => {
      const users = await controller.findUsersByEmail('test@example.com');
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('test@example.com');
    });
  });

  describe('findUser ()', () => {
    it('should return a single user with the given id', async () => {
      const user = await controller.findUser('1');
      expect(user).toBeDefined();
      expect(user.id).toEqual('1');
    });
    it('should throw an error if user not found', async () => {
      mockUsersService.findOne = jest.fn(() => Promise.resolve(null));
      await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('singin()', () => {
    it('should update the session object and return the user', async () => {
      const session = { userId: -10 };
      const user = await controller.signin(
        { email: 'test@example.com', password: 'test' },
        session,
      );
      expect(user.id).toEqual('1');
      expect(session.userId).toEqual('1');
    });
  });
});
