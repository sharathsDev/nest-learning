import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
  Session,
} from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    );

    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);

    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
    return;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    return user;
  }

  @Get('/')
  async findUsersByEmail(@Query('email') email: string) {
    const users = await this.usersService.find(email);
    if (!users || users.length === 0) {
      throw new NotFoundException(`Users not found with email ${email}`);
    }
    return users;
  }

  @Patch('/:id')
  updateUser(@Body() body: updateUserDto, @Param('id') id: string) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
