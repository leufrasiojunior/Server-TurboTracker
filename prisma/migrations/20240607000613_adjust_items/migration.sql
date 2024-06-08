-- AlterTable
ALTER TABLE `Result` MODIFY `ping` DOUBLE NULL,
    MODIFY `download` DOUBLE NULL,
    MODIFY `upload` DOUBLE NULL,
    MODIFY `data` LONGTEXT NULL,
    MODIFY `packetloss` DOUBLE NULL,
    MODIFY `scheduled` DOUBLE NULL,
    MODIFY `status` VARCHAR(191) NULL;
