-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('HRD', 'Society') NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `description` TEXT NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `society` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portofolio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skill` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `society_id` INTEGER NOT NULL,

    INDEX `society_id`(`society_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `available_position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position_name` VARCHAR(100) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `submission_start_date` DATE NOT NULL,
    `submission_end_date` DATE NOT NULL,
    `company_id` INTEGER NOT NULL,

    INDEX `company_id`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position_applied` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `available_position_id` INTEGER NOT NULL,
    `society_id` INTEGER NOT NULL,
    `apply_date` DATE NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NULL DEFAULT 'PENDING',

    INDEX `available_position_id`(`available_position_id`),
    INDEX `society_id`(`society_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `society` ADD CONSTRAINT `society_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `portofolio` ADD CONSTRAINT `portofolio_ibfk_1` FOREIGN KEY (`society_id`) REFERENCES `society`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `available_position` ADD CONSTRAINT `available_position_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `position_applied` ADD CONSTRAINT `position_applied_ibfk_1` FOREIGN KEY (`available_position_id`) REFERENCES `available_position`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `position_applied` ADD CONSTRAINT `position_applied_ibfk_2` FOREIGN KEY (`society_id`) REFERENCES `society`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
