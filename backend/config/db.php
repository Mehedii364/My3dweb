<?php
/**
 * MEHEDI 3D - Production Database Connection
 * Compatible with PHP 8.2 and MySQL 5.7 on ProFreeHost (Apache / cPanel)
 *
 * @license Apache-2.0
 * @author Md. Mehedi Hasan (Mehedi364)
 */

declare(strict_types=1);

// Disable direct error output to visitors (security hardening)
ini_set('display_errors', '0');
error_reporting(E_ALL);

class Database {
    // ProFreeHost provides MySQL credentials in the cPanel
    // Example host: sqlXXX.epizy.com or localhost
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private string $charset = 'utf8mb4';
    private ?PDO $conn = null;

    public function __construct() {
        // Read from environment if set, otherwise use ProFreeHost configuration constants
        $this->host = getenv('DB_HOST') ?: (defined('DB_HOST') ? DB_HOST : 'localhost');
        $this->db_name = getenv('DB_NAME') ?: (defined('DB_NAME') ? DB_NAME : 'mehedi_3d_db');
        $this->username = getenv('DB_USER') ?: (defined('DB_USER') ? DB_USER : 'root');
        $this->password = getenv('DB_PASS') ?: (defined('DB_PASS') ? DB_PASS : '');
    }

    public function getConnection(): ?PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            return $this->conn;
        } catch (PDOException $e) {
            // Log error safely without leaking credentials to client
            error_log("Database connection failure: " . $e->getMessage());
            return null;
        }
    }
}
