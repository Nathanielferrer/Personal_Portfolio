<?php
/**
 * Portfolio Contact Form Endpoint (PHP + PHPMailer)
 * Minimal & Secure:
 *  - CORS & Preflight handling
 *  - Honeypot Anti-Bot Filter
 *  - Server-side field validation
 *  - Direct PHPMailer dispatch with Reply-To
 */

// Allow CORS for local development (Vite dev server) & production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit();
}

// Parse request payload (JSON or Form URL-encoded)
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

// 1. Honeypot check: Legitimate users leave '_gotcha' empty; bots fill it
if (!empty($inputData['_gotcha'])) {
    // Silently return success to fool bots without sending email
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been received.'
    ]);
    exit();
}

// 2. Submission Velocity / Time-trap check (Only block if positive elapsed time is under 0.5s)
if (isset($inputData['_time']) && is_numeric($inputData['_time'])) {
    $elapsedSeconds = (time() * 1000 - (float)$inputData['_time']) / 1000;
    if ($elapsedSeconds > 0 && $elapsedSeconds < 0.5) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been received.'
        ]);
        exit();
    }
}

// 3. Extract & Sanitize fields (Strip newlines to prevent SMTP Header Injection)
$name    = isset($inputData['name']) ? trim(strip_tags((string)$inputData['name'])) : '';
$name    = preg_replace('/[\r\n\t]+/', ' ', $name);

$email   = isset($inputData['email']) ? trim(filter_var((string)$inputData['email'], FILTER_SANITIZE_EMAIL)) : '';
$email   = preg_replace('/[\r\n\t]+/', '', $email);

$subject = isset($inputData['subject']) && trim((string)$inputData['subject']) !== '' 
            ? trim(strip_tags((string)$inputData['subject'])) 
            : 'Portfolio Inquiry';
$subject = preg_replace('/[\r\n\t]+/', ' ', $subject);

$message = isset($inputData['message']) ? trim((string)$inputData['message']) : '';

// 4. Strict Server-Side Validation for all fields
$errors = [];

// Name: 2-60 chars, must contain letters, no numbers-only or pure symbols
if (empty($name)) {
    $errors[] = 'Please enter your name.';
} elseif (mb_strlen($name) < 2 || mb_strlen($name) > 60) {
    $errors[] = 'Name must be between 2 and 60 characters.';
} elseif (!preg_match("/^[a-zA-Z\s'.-]+$/u", $name) || !preg_match("/[a-zA-Z]/", $name)) {
    $errors[] = 'Please enter a valid name containing letters (numbers only are not allowed).';
}

// Email: Standard RFC format & must end in @gmail.com
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100 || !preg_match('/^[a-zA-Z0-9._%+-]+@gmail\.com$/i', $email)) {
    $errors[] = 'Please enter a valid Gmail address ending with @gmail.com.';
}

// Subject: Max 100 chars
if (mb_strlen($subject) > 100) {
    $errors[] = 'Subject must not exceed 100 characters.';
}

// Message: Minimum 10 chars, maximum 3,000 chars
if (empty($message)) {
    $errors[] = 'Please enter your message.';
} elseif (mb_strlen($message) < 10) {
    $errors[] = 'Message is too short (minimum 10 characters required).';
} elseif (mb_strlen($message) > 3000) {
    $errors[] = 'Message exceeds the maximum limit of 3,000 characters.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit();
}

// 5. Load Configuration & PHPMailer
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile) && file_exists(__DIR__ . '/config.example.php')) {
    $configFile = __DIR__ . '/config.example.php';
}
$config = file_exists($configFile) ? require $configFile : [];

// Check for unconfigured placeholder password
$rawPassword = $config['smtp_pass'] ?? '';
if (empty($rawPassword) || $rawPassword === 'YOUR_16_CHAR_GOOGLE_APP_PASSWORD_HERE') {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Email service is not yet configured. Please create api/config.php with your credentials.'
    ]);
    exit();
}

require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Initialize PHPMailer
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth   = $config['smtp_auth'] ?? true;
    $mail->Username   = $config['smtp_user'] ?? 'nathanielferrer691@gmail.com';
    // Clean spaces from Google App Password if present
    $mail->Password   = str_replace(' ', '', $config['smtp_pass'] ?? '');
    $mail->SMTPSecure = ($config['smtp_secure'] ?? 'tls') === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $config['smtp_port'] ?? 587;
    $mail->CharSet    = 'UTF-8';

    // Recipients
    // The authenticated Gmail account MUST be the SMTP From address
    $mail->setFrom($config['smtp_user'] ?? 'nathanielferrer691@gmail.com', $name . ' (via Portfolio)');
    $mail->addAddress($config['recipient_email'] ?? 'nathanielferrer691@gmail.com', $config['recipient_name'] ?? 'Nathaniel Ferrer');
    // Set client email as Reply-To so clicking 'Reply' in Gmail replies directly to the client
    $mail->addReplyTo($email, $name);

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Message: ' . $subject;

    $htmlBody = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b;'>
        <div style='border-bottom: 2px solid #38bdf8; padding-bottom: 14px; margin-bottom: 20px;'>
            <h2 style='margin: 0; color: #0f172a; font-size: 20px;'>New Portfolio Inquiry</h2>
            <p style='margin: 4px 0 0; color: #64748b; font-size: 13px;'>Sent from your portfolio contact form</p>
        </div>
        <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <tr>
                <td style='padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;'><strong>From:</strong></td>
                <td style='padding: 8px 0; color: #0f172a; font-size: 14px;'>" . htmlspecialchars($name) . "</td>
            </tr>
            <tr>
                <td style='padding: 8px 0; color: #64748b; font-size: 14px;'><strong>Email:</strong></td>
                <td style='padding: 8px 0; color: #0f172a; font-size: 14px;'><a href='mailto:" . htmlspecialchars($email) . "' style='color: #0284c7; text-decoration: none;'>" . htmlspecialchars($email) . "</a></td>
            </tr>
            <tr>
                <td style='padding: 8px 0; color: #64748b; font-size: 14px;'><strong>Subject:</strong></td>
                <td style='padding: 8px 0; color: #0f172a; font-size: 14px;'>" . htmlspecialchars($subject) . "</td>
            </tr>
        </table>
        <div style='background: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 6px; margin-bottom: 20px;'>
            <p style='margin: 0 0 6px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;'>Message Body:</p>
            <p style='margin: 0; color: #0f172a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;'>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        <div style='font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;'>
            Received at " . date('F j, Y, g:i a') . "
        </div>
    </div>";

    $altBody = "New Portfolio Message\n\n"
             . "From: " . $name . "\n"
             . "Email: " . $email . "\n"
             . "Subject: " . $subject . "\n\n"
             . "Message:\n" . $message . "\n\n"
             . "Sent on: " . date('Y-m-d H:i:s');

    $mail->Body    = $htmlBody;
    $mail->AltBody = $altBody;

    $mail->send();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you, ' . htmlspecialchars($name) . '! Your message has been sent successfully.'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Mailer error: Unable to send email at this time.',
        'error'   => $mail->ErrorInfo
    ]);
}
