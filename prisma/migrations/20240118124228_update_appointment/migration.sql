/*
  Warnings:

  - Added the required column `Accepted` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Pending', 'Done');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "Accepted" BOOLEAN NOT NULL,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
