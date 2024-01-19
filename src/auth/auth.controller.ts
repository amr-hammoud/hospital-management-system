import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, LoginUserResponseDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() loginInfo: LoginUserDto): Promise<LoginUserResponseDto> {
    return this.auth.authenticateUser(loginInfo.email, loginInfo.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Req() request: Request) {
    return this.auth.logout(request);
  }
}
