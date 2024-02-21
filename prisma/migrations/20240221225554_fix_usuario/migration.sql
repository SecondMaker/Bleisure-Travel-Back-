/*
  Warnings:

  - Added the required column `Name` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User_Id` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Info_clientes` ADD COLUMN `Name` VARCHAR(191) NOT NULL,
    ADD COLUMN `Type` VARCHAR(191) NOT NULL,
    ADD COLUMN `User_Id` INTEGER NOT NULL;
