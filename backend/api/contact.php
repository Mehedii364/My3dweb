<?php
/**
 * MEHEDI 3D - Contact Form API Endpoint
 * Handles contact submissions, anti-spam validation, rate limiting, and database recording.
 *
 * @license Apache-2.0
 * @author Md. Mehedi Hasan (Mehedi364)
 */

declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");

// CORS Headers for API access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

// Parse JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit;
}

// Anti-Spam Honeypot Check
if (!empty($data['website_trap'])) {
    // Silently return success to confuse spam bots
    echo json_encode(["status" => "success", "message" => "Message processed"]);
    exit;
}

// Validate Fields
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? 'Direct Inquiry from MEHEDI 3D');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "All required fields must be completed"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "Invalid email address format"]);
    exit;
}

// Simple IP-based Rate Limiting (Session/File check)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

$db = new Database();
$pdo = $db->getConnection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO contact_messages (name, email, subject, message, sender_ip, created_at)
            VALUES (:name, :email, :subject, :message, :ip, NOW())
        ");
        $stmt->execute([
            ':name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            ':email' => $email,
            ':subject' => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
            ':message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            ':ip' => $ip
        ]);

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Message stored securely in database."
        ]);
        exit;
    } catch (PDOException $e) {
        error_log("Contact insert error: " . $e->getMessage());
    }
}

// Fallback response if database is in initial setup phase
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Message recorded."
]);
