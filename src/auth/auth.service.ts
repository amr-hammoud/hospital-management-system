import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginUserResponseDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<LoginUserResponseDto> {
    let response: LoginUserResponseDto = {
      user: {
        id: null,
        email: '',
        name: '',
        role: null,
        profileID: null,
        departmentID: null,
      },
      token: '',
    };

    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    response.user.id = user.id;
    response.user.email = user.email;
    response.user.name = user.name;
    response.user.role = user.role;

    if (user.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUniqueOrThrow({
        where: { userId: user.id },
      });
      response.user.profileID = doctor.id;
      response.user.departmentID = doctor.departmentID;
    } else if (user.role === 'PATIENT') {
      const patient = await this.prisma.patient.findUniqueOrThrow({
        where: { userId: user.id },
      });
      response.user.profileID = patient.id;
    }

    const secretKey = this.configService.get<string>('SECRETKEY');
    const token = await this.jwtService.signAsync(response.user, {
      secret: secretKey,
    });
    response.token = token;

    const { id } = user;
    const markLogin = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        token,
      }
    });

    return response;
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async logout(@Req() request: Request){
    const user = request['user'];
    const { id } = user;
    const markLogin = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        token: null,
      }
    });
    return {
      message: "Logged Out Successfully",
      statusCode: 200,
    }
  }
}
