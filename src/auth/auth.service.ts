import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserWithoutPassword } from 'src/types/user.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithoutPassword = { ...user, password: undefined };

    const secretKey = this.configService.get<string>('SECRETKEY');

    const token = await this.jwtService.signAsync(userWithoutPassword, { secret: secretKey });

    return { user: userWithoutPassword, token };
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
