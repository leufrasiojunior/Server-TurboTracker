/*
  Warnings:

  - You are about to alter the column `status` on the `results` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `results` MODIFY `status` VARCHAR(191) NULL,
    MODIFY `scheduled` BOOLEAN NULL;
