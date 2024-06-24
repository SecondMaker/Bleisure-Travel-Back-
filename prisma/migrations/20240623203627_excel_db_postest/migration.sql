/*
  Warnings:

  - Added the required column `costo` to the `ExcelDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExcelDB` ADD COLUMN `costo` VARCHAR(191) NOT NULL;
