/*
  Warnings:

  - You are about to drop the column `Name` on the `Info_clientes` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Info_clientes` table. All the data in the column will be lost.
  - You are about to drop the column `User_Id` on the `Info_clientes` table. All the data in the column will be lost.
  - Added the required column `name` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Id` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Info_clientes` DROP COLUMN `Name`,
    DROP COLUMN `Type`,
    DROP COLUMN `User_Id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `user_Id` INTEGER NOT NULL;
