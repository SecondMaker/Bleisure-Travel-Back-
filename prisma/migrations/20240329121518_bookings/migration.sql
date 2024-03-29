/*
  Warnings:

  - Added the required column `codigoTicket` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoAbonado` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoTotal` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `codigoTicket` VARCHAR(191) NOT NULL,
    ADD COLUMN `montoAbonado` VARCHAR(191) NOT NULL,
    ADD COLUMN `montoTotal` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
