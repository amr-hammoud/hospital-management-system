import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/user.dto';
import { User } from '@prisma/client';
import { UserWithoutPassword } from 'src/types/user.type';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(
    @Body() loginInfo: LoginUserDto,
  ): Promise<{ user: UserWithoutPassword; token: string }> {
    return this.auth.authenticateUser(loginInfo.email, loginInfo.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
