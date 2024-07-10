/*
  Warnings:

  - You are about to drop the column `aerolinea` on the `ExcelDB` table. All the data in the column will be lost.
  - You are about to drop the column `condiciones` on the `ExcelDB` table. All the data in the column will be lost.
  - You are about to drop the column `costo` on the `ExcelDB` table. All the data in the column will be lost.
  - You are about to drop the column `incluye` on the `ExcelDB` table. All the data in the column will be lost.
  - Added the required column `cambios` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destino` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipaje_bodega` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipaje_mano` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reembolso` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExcelDB` DROP COLUMN `aerolinea`,
    DROP COLUMN `condiciones`,
    DROP COLUMN `costo`,
    DROP COLUMN `incluye`,
    ADD COLUMN `cambios` VARCHAR(191) NOT NULL,
    ADD COLUMN `destino` VARCHAR(191) NOT NULL,
    ADD COLUMN `equipaje_bodega` VARCHAR(191) NOT NULL,
    ADD COLUMN `equipaje_mano` VARCHAR(191) NOT NULL,
    ADD COLUMN `reembolso` VARCHAR(191) NOT NULL;
