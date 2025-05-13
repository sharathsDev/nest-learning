import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UsersService>;
  beforeEach(async () => {
    // create mock userService
    const users: User[] = [];
    mockUserService = {
      find: (email: string) => {
        const filtereduser = users.filter((user) => user.email === email);
        return Promise.resolve(filtereduser);
      },
      create: (name: string, email: string, password: string) => {
        const newUser = {
          id: String(Date.now()),
          name,
          email,
          password,
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('signUp', () => {
    it('should create a new user', async () => {
      const user = await service.signup('test', 'test@example.com', 'test');
      expect(user.password).not.toEqual('test');
      const isPassword = await argon2.verify(user.password, 'test', {
        secret: Buffer.from('mysecret'),
      });
      expect(isPassword).toBe(true);
    });
    it('should throw an error if user already exists', async () => {
      await service.signup('test', 'test@example.com', 'test');
      await expect(
        service.signup('test', 'test@example.com', 'test'),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('signin', () => {
    it('should throw an error if user does not exist', async () => {
      await expect(service.signin('test@example.com', 'test')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw an error if password is incorrect', async () => {
      const hashedPassword = await argon2.hash('test', {
        secret: Buffer.from('mysecret'),
      });
      await service.signup('test', 'test@example.com', hashedPassword);
      await expect(service.signin('test@example.com', 'test1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
