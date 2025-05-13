import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(name: string, email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await argon2.hash(password, {
      secret: Buffer.from('mysecret'),
    });
    const newUser = this.usersService.create(name, email, hashedPassword);
    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (!user || !user.length) {
      throw new NotFoundException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(user[0].password, password, {
      secret: Buffer.from('mysecret'),
    });
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user[0];
  }
}
