/*
  Warnings:

  - A unique constraint covering the columns `[doctorID,dateTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorID_dateTime_key" ON "Appointment"("doctorID", "dateTime");
