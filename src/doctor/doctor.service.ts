import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AssignPatientDoctorDto } from './dto/doctor.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

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
