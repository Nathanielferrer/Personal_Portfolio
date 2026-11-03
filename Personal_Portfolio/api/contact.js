import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS & Preflight handling
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, email, subject, message, _gotcha } = body;

    // 1. Honeypot check: Bots fill hidden fields; humans leave it empty
    if (_gotcha) {
      return res.status(200).json({ success: true, message: 'Thank you! Your message has been received.' });
    }

    // 2. Extract & Sanitize fields
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedSubject = (subject || '').trim() || 'Portfolio Inquiry';
    const trimmedMessage = (message || '').trim();

    // 3. Validation checks
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 60) {
      return res.status(400).json({ success: false, message: 'Please enter a valid name (2-60 characters).' });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(trimmedEmail) || trimmedEmail.length > 100) {
      return res.status(400).json({ success: false, message: 'Please enter a valid Gmail address (@gmail.com).' });
    }

    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 3000) {
      return res.status(400).json({ success: false, message: 'Message must be between 10 and 3,000 characters.' });
    }

    // 4. Retrieve credentials securely from Vercel Environment Variables
    const smtpUser = process.env.GMAIL_USER || 'nathanielferrer691@gmail.com';
    const smtpPass = process.env.GMAIL_APP_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'nathanielferrer691@gmail.com';

    if (!smtpPass) {
      console.error('Missing GMAIL_APP_PASS environment variable on Vercel.');
      return res.status(500).json({
        success: false,
        message: 'Email service configuration missing. Please set GMAIL_APP_PASS in Vercel Environment Variables.'
      });
    }

    // 5. Initialize Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, '') // Strips spaces from 16-character Google App Password
      }
    });

    // 6. Dispatch Email with Reply-To header
    await transporter.sendMail({
      from: `"${trimmedName} (via Portfolio)" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: trimmedEmail,
      subject: `New Contact Message: ${trimmedSubject}`,
      text: `From: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #1e293b;">
          <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 14px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #0f172a; font-size: 20px;">New Portfolio Inquiry</h2>
            <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Sent from your portfolio contact form</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;"><strong>From:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${trimmedName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${trimmedEmail}" style="color: #0284c7; text-decoration: none;">${trimmedEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${trimmedSubject}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Message Body:</p>
            <p style="margin: 0; color: #0f172a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${trimmedMessage}</p>
          </div>
          <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
            Received via Vercel Serverless Function
          </div>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: `Thank you, ${trimmedName}! Your message has been sent successfully.`
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send inquiry. Please try again later.'
    });
  }
}

