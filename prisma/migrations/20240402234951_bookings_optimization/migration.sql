/*
  Warnings:

  - A unique constraint covering the columns `[codigo_reserva]` on the table `Bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bookings_codigo_reserva_key` ON `Bookings`(`codigo_reserva`);
