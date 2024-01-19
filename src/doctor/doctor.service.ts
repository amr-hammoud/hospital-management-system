import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AssignPatientDoctorDto } from './dto/doctor.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LoginUserResponseDto } from 'src/user/dto/user.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async getAppointments(@Req() request: Request): Promise<Object> {
    const user = request['user'];

    if (user.role === $Enums.UserRole.DOCTOR) {
      const appointments = this.prisma.appointment.findMany({
        where: { doctorID: user.profileID },
        select: {
          id: true,
          dateTime: true,
          duration: true,
          status: true,
          Accepted: true,
          createdAt: true,
          updatedAt: true,
          patient: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          }
        },
      });

      if ((await appointments).length >= 1) {
        return appointments;
      } else {
        throw new NotFoundException('No Appointments Found');
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async assignPatient(
    AssignPatientDoctorDto: AssignPatientDoctorDto,
  ): Promise<Object> {
    const result = await this.prisma.doctorPatient.create({
      data: {
        doctorID: AssignPatientDoctorDto.doctorID,
        patientID: AssignPatientDoctorDto.patientID,
      },
    });

    if (!result) {
      throw new InternalServerErrorException(
        'Error assigning patient to doctor',
      );
    }

    return {
      message: 'Patient assigned to doctor successfully',
      statusCode: 201,
    };
  }
}
