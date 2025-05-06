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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: createUserDto) {
    this.usersService.create(body.name, body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
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
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
