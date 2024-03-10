-- DropForeignKey
ALTER TABLE `Bookings` DROP FOREIGN KEY `Bookings_userId_fkey`;

-- AlterTable
ALTER TABLE `Bookings` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
