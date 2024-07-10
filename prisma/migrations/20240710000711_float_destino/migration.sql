/*
  Warnings:

  - You are about to alter the column `destino` on the `ExcelDB` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `ExcelDB` MODIFY `destino` DOUBLE NOT NULL;
