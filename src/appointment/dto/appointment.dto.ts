import { $Enums } from "@prisma/client";

export class CreateAppointmentDto {
    doctorID?: number;
    patientID?: number;
    dateTime?: Date;
}
export class UpdateAppointmentStatusDto {
    status: $Enums.AppointmentStatus;
}