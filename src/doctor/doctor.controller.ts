import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AssignPatientDoctorDto } from './dto/doctor.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { request } from 'http';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(new RoleGuard(['ADMIN']))
  @Post('assign')
  create(@Body() AssignPatientDoctorDto: AssignPatientDoctorDto) {
    return this.doctorService.assignPatient(AssignPatientDoctorDto);
  }

  @UseGuards(new RoleGuard(['DOCTOR']))
  @Get('appointments')
  getAppointments(@Req() request: Request) {
    return this.doctorService.getAppointments(request)
  }
}
