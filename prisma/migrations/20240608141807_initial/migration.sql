/*
  Warnings:

  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Result`;

-- CreateTable
CREATE TABLE `results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ping` DOUBLE NULL,
    `download` DOUBLE NULL,
    `upload` DOUBLE NULL,
    `packetloss` DOUBLE NULL,
    `comments` VARCHAR(191) NULL,
    `data` LONGTEXT NULL,
    `status` VARCHAR(191) NULL,
    `scheduled` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
