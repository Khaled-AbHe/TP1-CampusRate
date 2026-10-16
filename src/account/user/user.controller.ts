import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get(':id')
  findOneUserById(@Param('id') id: string) {
    return this.usersService.findOneUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  removeUserById(@Param('id') id: string) {
    return this.usersService.removeUserById(id);
  }
}
