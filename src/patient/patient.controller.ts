import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':id/doctors')
  getAssignedDoctors(@Param('id') id: string) {
    return this.patientService.getAssignedDoctors(+id);
  }

}
