/*
  Warnings:

  - You are about to drop the column `ruta` on the `ExcelDB` table. All the data in the column will be lost.
  - You are about to drop the `Permisos` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `ExcelDB` DROP COLUMN `ruta`;

-- DropTable
DROP TABLE `Permisos`;
