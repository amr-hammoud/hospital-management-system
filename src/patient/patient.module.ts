import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PrismaService, JwtService, ConfigService],
})
export class PatientModule {}
