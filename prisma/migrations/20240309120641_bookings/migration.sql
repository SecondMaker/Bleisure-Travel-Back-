-- CreateTable
CREATE TABLE `Bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_reserva` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Bookings_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
