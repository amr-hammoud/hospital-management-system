import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentAcceptanceDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(new RoleGuard(['PATIENT']))
  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request
  ) {
    return this.appointmentService.create(createAppointmentDto, request);
  }

  @UseGuards(new RoleGuard(['PATIENT']))
  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: string,
    @Body() UpdateAppointmentStatusDto: UpdateAppointmentStatusDto,
    @Req() request: Request
  ) {
    return this.appointmentService.updateStatus(+id, UpdateAppointmentStatusDto, request);
  }

  @UseGuards(new RoleGuard(['DOCTOR']))
  @Patch(':id/update-acceptance')
  updateAcceptance(
    @Param('id') id: string,
    @Body() UpdateAppointmentAcceptanceDto: UpdateAppointmentAcceptanceDto,
    @Req() request: Request
  ) {
    return this.appointmentService.updateAcceptance(+id, UpdateAppointmentAcceptanceDto, request);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
  //   return this.appointmentService.update(+id, updateAppointmentDto);
  // }

  @UseGuards(new RoleGuard(['PATIENT']))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.appointmentService.remove(+id, request);
  }
}
