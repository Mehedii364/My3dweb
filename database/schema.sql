-- ====================================================================
-- MEHEDI 3D - Production Database Schema
-- Architecture Target: MySQL 5.7+ / MariaDB 10.3+ / ProFreeHost phpMyAdmin
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Owner: Md. Mehedi Hasan (Mehedi364) · Wafa Zone
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admin Users (Owner Authentication)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(30) NOT NULL DEFAULT 'owner',
  `last_login` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Central Profile Data
CREATE TABLE IF NOT EXISTS `profile` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(120) NOT NULL,
  `developer_identity` VARCHAR(60) NOT NULL DEFAULT 'Mehedi364',
  `github_username` VARCHAR(60) NOT NULL DEFAULT 'Mehedii364',
  `brand` VARCHAR(60) NOT NULL DEFAULT 'MEHEDI 3D',
  `ecosystem` VARCHAR(60) NOT NULL DEFAULT 'Wafa Zone',
  `ecosystem_tagline` VARCHAR(100) NOT NULL DEFAULT 'DREAM • DEVELOP • DELIVER',
  `headline` VARCHAR(255) NOT NULL,
  `subheadline` VARCHAR(255) NOT NULL,
  `bio` TEXT NOT NULL,
  `philosophy` VARCHAR(255) NOT NULL,
  `quote_english` TEXT NOT NULL,
  `quote_bengali` TEXT NOT NULL,
  `hero_image_id` INT UNSIGNED NULL,
  `avatar_image_id` INT UNSIGNED NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Profile Images (Owner Personal Photography & Assets)
CREATE TABLE IF NOT EXISTS `profile_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `file_path` VARCHAR(255) NOT NULL,
  `title` VARCHAR(120) NOT NULL,
  `description` TEXT NULL,
  `alt_text` VARCHAR(200) NOT NULL,
  `category` ENUM('portrait', 'studio', 'lifestyle', 'quote', 'project') NOT NULL DEFAULT 'portrait',
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `is_avatar` TINYINT(1) NOT NULL DEFAULT 0,
  `is_visible` TINYINT(1) NOT NULL DEFAULT 1,
  `dimensions` VARCHAR(50) NULL,
  `file_size_bytes` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Projects (GitHub Repositories & Curated Systems)
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `repo_name` VARCHAR(120) NOT NULL UNIQUE,
  `display_name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'wafa',
  `primary_language` VARCHAR(50) NOT NULL,
  `github_url` VARCHAR(255) NOT NULL,
  `live_url` VARCHAR(255) NULL,
  `stars_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `forks_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_fork` TINYINT(1) NOT NULL DEFAULT 0,
  `is_archived` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `last_pushed_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Project Images (Screenshots & Showcase Visuals)
CREATE TABLE IF NOT EXISTS `project_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(200) NULL,
  `is_cover` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  INDEX `idx_proj_img` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Skill Categories
CREATE TABLE IF NOT EXISTS `skill_categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Layers',
  `description` TEXT NOT NULL,
  `technologies` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  INDEX `idx_skill_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Experiences & Milestones
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period_label` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `organization` VARCHAR(150) NOT NULL,
  `category` ENUM('milestone', 'project', 'learning', 'education') NOT NULL DEFAULT 'milestone',
  `description` TEXT NOT NULL,
  `key_takeaways` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Education
CREATE TABLE IF NOT EXISTS `education` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `degree` VARCHAR(150) NOT NULL,
  `institution` VARCHAR(150) NOT NULL,
  `period` VARCHAR(50) NOT NULL,
  `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Services
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(50) NOT NULL DEFAULT 'Code2',
  `deliverables` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Blog Posts & Architecture Journals
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `tags` VARCHAR(255) NULL,
  `read_time` VARCHAR(30) NOT NULL DEFAULT '4 min read',
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Contact Messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `sender_ip` VARCHAR(45) NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  INDEX `idx_msg_created` (`created_at`),
  INDEX `idx_msg_unread` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. GitHub Cache
CREATE TABLE IF NOT EXISTS `github_cache` (
  `cache_key` VARCHAR(100) PRIMARY KEY,
  `cache_data` LONGTEXT NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. GitHub Sync Logs
CREATE TABLE IF NOT EXISTS `github_sync_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `synced_at` DATETIME NOT NULL,
  `status` VARCHAR(30) NOT NULL,
  `repos_fetched` INT NOT NULL DEFAULT 0,
  `rate_limit_remaining` INT NULL,
  `message` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Site Settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(80) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
