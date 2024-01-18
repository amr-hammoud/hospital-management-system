import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async getPatientById(id: number) {
    try {
      const patient = await this.prisma.patient.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return patient;
    } catch (error) {
      throw new NotFoundException('Patient Not Found');
    }
  }

  async getAssignedDoctors(id: number): Promise<Object> {
    try {
      const patient = await this.getPatientById(id);

      const doctorPatients = await this.prisma.doctorPatient.findMany({
        where: { patientID: id },
        select: {
          id: true,
          doctor: {
            select: {
              id: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!doctorPatients || doctorPatients.length === 0) {
        throw new NotFoundException('No Doctors Assigned to Patient');
      }

      return { data: doctorPatients, statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }
}
