/*
  Warnings:

  - Added the required column `dateTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL;
