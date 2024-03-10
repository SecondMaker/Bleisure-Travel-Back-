/*
  Warnings:

  - You are about to drop the column `userId` on the `Bookings` table. All the data in the column will be lost.
  - Added the required column `email` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Bookings` DROP FOREIGN KEY `Bookings_userId_fkey`;

-- AlterTable
ALTER TABLE `Bookings` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;
