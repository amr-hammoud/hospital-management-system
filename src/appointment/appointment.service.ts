import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDto, UpdateAppointmentAcceptanceDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Appointment, User } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request,
  ): Promise<Object> {
    try {
      const user = request['user'];
      const appointment = await this.prisma.appointment.create({
        data: {
          doctorID: createAppointmentDto.doctorID,
          patientID: user.profileID,
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
        throw error;
      }
    }
  }

  findAll() {
    return `This action returns all appointment`;
  }

  async findOne(id: number): Promise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return appointment;
    } catch (error) {
      throw new NotFoundException('Appointment Not Found');
    }
  }


  async updateStatus(id: number, UpdateAppointmentStatusDto: UpdateAppointmentStatusDto, @Req() request: Request): Promise<Object> {
    try {
      const user = request['user'];
      const appointment = await this.findOne(id);

      if (appointment.id) {
        if (appointment.patientID === user.profileID) {
          const updatedAppointment = await this.prisma.appointment.update({
            where: {
              id,
            },
            data: {
              status: UpdateAppointmentStatusDto.status,
            },
          });

          return {
            data: updatedAppointment,
            message: `Appointment status updated to ${UpdateAppointmentStatusDto.status}`,
            statusCode: 200,
          };
        } else {
          throw new UnauthorizedException(
            'Unauthorized to update appointment status',
          );
        }
      } else {
        throw new NotFoundException('Appointment Not Found');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateAcceptance(id: number, UpdateAppointmentAcceptanceDto: UpdateAppointmentAcceptanceDto, @Req() request: Request): Promise<Object> {
    try {
      const user = request['user'];
      const appointment = await this.findOne(id);

      if (appointment.id) {
        if (appointment.doctorID === user.profileID) {
          const updatedAppointment = await this.prisma.appointment.update({
            where: {
              id,
            },
            data: {
              Accepted: UpdateAppointmentAcceptanceDto.Accepted,
            },
          });

          return {
            data: updatedAppointment,
            message: `Appointment ${UpdateAppointmentAcceptanceDto.Accepted ? 'Accepted' : 'Rejected'}`,
            statusCode: 200,
          };
        } else {
          throw new UnauthorizedException(
            'Unauthorized to update appointment Acceptance',
          );
        }
      } else {
        throw new NotFoundException('Appointment Not Found');
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, @Req() request: Request): Promise<Object> {
    try {
      const user = request['user'];
      const appointment = await this.findOne(id);

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
          throw new UnauthorizedException();
        }
      } else {
        throw new NotFoundException('Appointment Not Found');
      }
    } catch (error) {
      throw error;
    }
  }
}
