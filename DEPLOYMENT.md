# MEHEDI 3D — ProFreeHost Production Deployment Handbook

**Owner:** Md. Mehedi Hasan (@Mehedii364)  
**Brand:** MEHEDI 3D  
**Ecosystem:** Wafa Zone  
**Target Hosting:** [ProFreeHost](https://profreehost.com)  
**Stack:** React + TypeScript + Three.js + PHP 8.2 + MySQL 5.7  

---

## 01. Architecture Overview

MEHEDI 3D is designed strictly around ProFreeHost's shared hosting architecture:
- **No Node.js or Redis server required at runtime**.
- The React + TypeScript + Three.js frontend compiles to static HTML/JS/CSS assets with all chunks under 2MB (well below the ProFreeHost 10MB individual file limit).
- The backend runs on pure **PHP 8.2** with PDO prepared queries.
- Database runs on **MySQL 5.7+** with `utf8mb4` encoding.

---

## 02. Pre-Deployment Build

1. Build the frontend locally:
   ```bash
   npm run build
   ```
2. The compiled assets will be in `dist/`.

---

## 03. Directory Structure on ProFreeHost

Upload the files via FTP (FileZilla) or the ProFreeHost File Manager into `htdocs/`:

```
htdocs/
├── index.html               # Compiled frontend entry point
├── assets/                  # Compact JS & CSS bundles
├── api/                     # PHP 8.2 API endpoints
│   ├── profile.php
│   ├── projects.php
│   ├── contact.php
│   ├── github.php
│   └── gallery.php
├── config/
│   └── db.php               # PDO database credentials
├── database/
│   ├── schema.sql           # MySQL 5.7 schema
│   └── seed.sql             # Initial data
├── uploads/                 # Uploaded photos (.htaccess blocks PHP execution)
└── .htaccess                # SPA routing, security headers, upload execution blocking
```

---

## 04. Database Configuration (phpMyAdmin)

1. Log into your ProFreeHost Control Panel (cPanel).
2. Go to **MySQL Databases** and create a new database (e.g., `epiz_xxxx_mehedi3d`).
3. Note your database credentials:
   - **Host:** e.g., `sqlXXX.epizy.com` (Do NOT assume `localhost`!)
   - **Database Name:** `epiz_xxxx_mehedi3d`
   - **User:** `epiz_xxxx`
   - **Password:** Your vPanel account password
4. Open **phpMyAdmin**, select the newly created database, and click **Import**.
5. Upload and execute `database/schema.sql`, followed by `database/seed.sql`.
6. Edit `config/db.php` on the server and insert your database host, name, user, and password.

---

## 05. Security Rules

- Direct HTTP access to `.sql`, `.log`, `.env`, and config files is blocked via `.htaccess`.
- Script execution inside the `uploads/` directory is blocked via Apache rewrite rule (`RewriteRule ^uploads/.*\.php$ - [F,L]`).
- Contact form utilizes a honeypot field and input validation to stop automated bot spam.
- Passwords for the owner dashboard use `password_hash()` and `password_verify()`.

---

## 06. Owner Admin Dashboard

Access the private owner dashboard by clicking **Owner Portal** in the website header or footer.  
- Initial Setup Passphrase: `mehedi364` or `wafa2026`
- Once logged in, you can upload new photographs, choose which one is the 3D workstation hero portrait, toggle featured GitHub projects, and inspect visitor contact messages.
