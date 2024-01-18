import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Object> {
    try {
      const appointment = await this.prisma.appointment.create({
        data: {
          doctorID: createAppointmentDto.doctorID,
          patientID: createAppointmentDto.patientID,
          dateTime: new Date(createAppointmentDto.dateTime), // Convert to Date object
          duration: 30,
        },
      });

      return {
        data: appointment,
        message: 'Appointment Created Successfully',
        statusCode: 201,
      };
    } catch (error) {
      if (error.code === 'P2002'){
        throw new ConflictException('Appointment time slot is already booked.');
      }
      else{
        throw new InternalServerErrorException;
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

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
