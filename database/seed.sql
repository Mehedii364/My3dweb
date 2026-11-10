-- ====================================================================
-- MEHEDI 3D - Initial Seed Data (MySQL 5.7+ Compatible)
-- Authentic profile and baseline structural records
-- ====================================================================

-- Default Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('site_title', 'MEHEDI 3D — Md. Mehedi Hasan', NOW()),
('active_theme', 'dark_obsidian', NOW()),
('enable_3d_mode', '1', NOW()),
('github_sync_frequency_hours', '6', NOW()),
('contact_email_destination', 'useable.me2@gmail.com', NOW());

-- Central Profile Seed
INSERT INTO `profile` (
  `id`, `full_name`, `developer_identity`, `github_username`, `brand`, `ecosystem`,
  `ecosystem_tagline`, `headline`, `subheadline`, `bio`, `philosophy`,
  `quote_english`, `quote_bengali`, `updated_at`
) VALUES (
  1,
  'Md. Mehedi Hasan',
  'Mehedi364',
  'Mehedii364',
  'MEHEDI 3D',
  'Wafa Zone',
  'DREAM • DEVELOP • DELIVER',
  'Web Developer • Software Engineer • Programmer',
  'Turning Ideas into Powerful Digital Experiences.',
  'Passionate software and web developer dedicated to building impactful digital solutions, intuitive user interfaces, and robust systems. Creator of the Wafa Zone ecosystem.',
  'THINK → LEARN → DESIGN → BUILD → TEST → IMPROVE → TRANSFORM',
  'Don''t forget your enemy''s help, and don''t forget your friend''s betrayal.',
  'শত্রুর কাছ থেকে পাওয়া সাহায্য কখনো ভুলে যেও না, আর বন্ধুর কাছ থেকে পাওয়া বিশ্বাসঘাতকতাও কখনো ভুলো না।',
  NOW()
) ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- Initial Curated Repositories
INSERT INTO `projects` (
  `repo_name`, `display_name`, `description`, `category`, `primary_language`,
  `github_url`, `live_url`, `stars_count`, `forks_count`, `is_featured`, `created_at`, `updated_at`
) VALUES
('Wafa-Deen', 'Wafa Deen', 'Comprehensive Islamic companion app providing prayer times, Qibla compass, and Al-Quran recitations.', 'wafa', 'Kotlin / Java', 'https://github.com/Mehedii364/Wafa-Deen', 'https://github.com/Mehedii364/Wafa-Deen/releases', 12, 3, 1, NOW(), NOW()),
('Wafa-Camera-Pro', 'Wafa Camera Pro', 'Manual exposure controls, RAW capture support, and Camera2 API image processing.', 'wafa', 'Java', 'https://github.com/Mehedii364/Wafa-Camera-Pro', NULL, 8, 2, 1, NOW(), NOW()),
('Wafa-AI', 'Wafa AI Assistant', 'Intelligent conversational assistant and productivity toolkit powered by modern AI APIs.', 'wafa', 'TypeScript', 'https://github.com/Mehedii364/Wafa-AI', NULL, 15, 4, 1, NOW(), NOW()),
('ONEBD', 'ONEBD Platform', 'Unified public utility portal with emergency contacts and administrative directories of Bangladesh.', 'web', 'PHP / MySQL', 'https://github.com/Mehedii364/ONEBD', NULL, 9, 3, 1, NOW(), NOW()),
('Brain-Helper', 'Brain Helper', 'Cognitive exercise, spaced-repetition training, and programming flashcards.', 'tools', 'React', 'https://github.com/Mehedii364/Brain-Helper', NULL, 11, 3, 1, NOW(), NOW()),
('Bangladesh-Geographical-Data', 'Bangladesh Geospatial Data API', 'Structured JSON and SQL dataset containing 8 divisions, 64 districts, and 495 upazilas.', 'tools', 'SQL / JSON', 'https://github.com/Mehedii364/Bangladesh-Geographical-Data', NULL, 18, 7, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `display_name` = VALUES(`display_name`);
