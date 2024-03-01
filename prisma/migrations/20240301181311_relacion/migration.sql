/*
  Warnings:

  - You are about to drop the column `id_User` on the `Info_clientes` table. All the data in the column will be lost.
  - You are about to alter the column `phone` on the `Info_clientes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - A unique constraint covering the columns `[userId]` on the table `Info_clientes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Info_clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Info_clientes` DROP COLUMN `id_User`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `phone` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Info_clientes_userId_key` ON `Info_clientes`(`userId`);

-- AddForeignKey
ALTER TABLE `Info_clientes` ADD CONSTRAINT `Info_clientes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
