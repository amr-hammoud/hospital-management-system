import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Object> {
    try {
      const appointment = await this.prisma.appointment.create({
        data: {
          doctorID: createAppointmentDto.doctorID,
          patientID: createAppointmentDto.patientID,
          dateTime: new Date(createAppointmentDto.dateTime),
          duration: 30,
        },
      });

      return {
        data: appointment,
        message: 'Appointment Created Successfully',
        statusCode: 201,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Appointment time slot is already booked.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  async remove(id: number, @Req() request: Request): Promise<Object> {
    const user = request['user'];
    let appointment: Appointment;
    try {
      appointment = await this.prisma.appointment.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException('Appointment Not Found');
    }

    try {
      if (appointment.id) {
        if (appointment.patientID === user.profileID) {
          const deleteAppointment = await this.prisma.appointment.delete({
            where: {
              id,
            },
          });

          if (deleteAppointment) {
            return {
              message: 'Appointment Canceled Successfully',
              statusCode: 200,
            };
          }
        } else {
          throw new UnauthorizedException
        }
      } else {
        throw new NotFoundException('Appointment Not Found');
      }
    } catch (error) {
      throw error;
    }
  }
}
