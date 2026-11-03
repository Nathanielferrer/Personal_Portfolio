<?php
/**
 * Contact Form SMTP & Email Configuration (Template)
 * 
 * Instructions:
 * 1. Copy or duplicate this file and name the copy 'config.php' in this same directory.
 * 2. Enable 2-Step Verification on your Google Account: https://myaccount.google.com/security
 * 3. Generate a 16-character Google App Password: https://myaccount.google.com/apppasswords
 * 4. Replace 'your-email@gmail.com' and 'YOUR_16_CHAR_GOOGLE_APP_PASSWORD_HERE' below.
 * 5. NEVER commit your actual 'config.php' with real passwords to a public GitHub repository.
 */

return [
    // SMTP Server Settings
    'smtp_host'       => 'smtp.gmail.com',
    'smtp_port'       => 587,
    'smtp_auth'       => true,
    'smtp_secure'     => 'tls', // 'tls' or 'ssl'

    // Credentials (Fill in your details in config.php)
    'smtp_user'       => 'your-email@gmail.com',
    'smtp_pass'       => 'YOUR_16_CHAR_GOOGLE_APP_PASSWORD_HERE',

    // Destination & Sender
    'recipient_email' => 'your-email@gmail.com',
    'recipient_name'  => 'Your Name',
    'sender_name'     => 'Portfolio Contact Form',

    // Environment Mode
    'mode'            => 'auto', // 'auto' | 'smtp' | 'log_only'
];

