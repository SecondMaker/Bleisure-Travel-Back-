-- CreateTable
CREATE TABLE `ExcelDB` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruta` VARCHAR(191) NOT NULL,
    `aerolinea` VARCHAR(191) NOT NULL,
    `iata` VARCHAR(191) NOT NULL,
    `tarifa` VARCHAR(191) NOT NULL,
    `costo` VARCHAR(191) NOT NULL,
    `clasificacion` VARCHAR(191) NOT NULL,
    `incluye` VARCHAR(191) NOT NULL,
    `condiciones` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
