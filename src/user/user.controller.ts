import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(new RoleGuard(['ADMIN']))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(new RoleGuard(['ADMIN']))
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe()) page?: number,
    @Query('pageSize', new ParseIntPipe()) pageSize?: number,
    @Query('admins') admins?: boolean,
  ): Promise<User[]> {
    return this.userService.findAll(page, pageSize, admins);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('/bymail/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(new RoleGuard(['ADMIN']))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
