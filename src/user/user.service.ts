import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { $Enums, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from 'src/types/user.type';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const { email, password, name, role } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    if (!user) {
      throw new InternalServerErrorException('Error creating user');
    }

    if (role === 'DOCTOR') {
      // TODO: Take departmentID from user input
      const doctor = await this.prisma.doctor.create({
        data: {
          userId: user.id,
          departmentID: 7,
        },
      });

      if (!doctor) {
        throw new InternalServerErrorException('Error creating doctor');
      }
    } else if (role === 'PATIENT') {
      const patient = await this.prisma.patient.create({
        data: {
          userId: user.id,
        },
      });

      if (!patient) {
        throw new InternalServerErrorException('Error creating patient');
      }
    }

    const returningUser = { ...user, password: undefined };

    return returningUser;
  }

  async findAll(
    page: number,
    pageSize: number,
    admins: boolean,
  ): Promise<User[]> {
    const skip = (page - 1) * pageSize;
    let users;

    if (admins) {
      users = await this.prisma.user.findMany({
        skip,
        take: pageSize,
      });
    } else {
      users = await this.prisma.user.findMany({
        skip,
        take: pageSize,
        where: {
          role: {
            in: ['DOCTOR', 'PATIENT'],
          },
        },
      });
    }

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return `User with ID ${id} has been successfully removed`;
  }
}
