/*
  Warnings:

  - Added the required column `scheduled` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Result` ADD COLUMN `scheduled` DOUBLE NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
