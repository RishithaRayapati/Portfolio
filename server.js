const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(express.json({ limit: '20kb' }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
  })
);

// In-memory Rate Limiting (5 requests per 15 minutes per IP)
const ipRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

// Clean up stale rate-limit records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRateLimitMap.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
      ipRateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function rateLimiter(req, res, next) {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = ipRateLimitMap.get(clientIp);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRateLimitMap.set(clientIp, { count: 1, startTime: now });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many messages sent from this connection. Please try again in 15 minutes.',
    });
  }

  record.count += 1;
  next();
}

// Helper: Sanitize string to prevent HTML/XSS injection
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: Validate email format
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.trim().length <= 150;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Portfolio Contact API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/contact', (req, res) => {
  res.status(200).json({
    message: 'Contact API is active. Send a POST request with name, email, subject, and message.',
  });
});

// Contact Form Submission Endpoint
app.post('/api/contact', rateLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, _gotcha, honeypot } = req.body;

    // 1. Spam check: Honeypot field inspection
    if (_gotcha || honeypot) {
      // Silently accept without sending email to deceive bots
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!',
      });
    }

    // 2. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name (between 2 and 100 characters).',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject (between 2 and 200 characters).',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message (between 5 and 3000 characters).',
      });
    }

    // 3. Check SMTP Configuration
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const contactReceiver = process.env.CONTACT_RECEIVER || emailUser || 'rishitharayapati40@gmail.com';

    if (
      !emailUser ||
      !emailPass ||
      emailPass === 'your_gmail_app_password' ||
      emailUser === 'your_email@gmail.com'
    ) {
      console.warn(
        '\n[WARNING] EMAIL_USER or EMAIL_PASS is not configured in .env.\n' +
        'Please add your real Gmail and 16-character Google App Password to .env to enable email delivery.\n'
      );
      return res.status(503).json({
        success: false,
        message: 'Email service is currently awaiting SMTP configuration. Please reach out directly to rishitharayapati40@gmail.com.',
      });
    }

    // 4. Create Nodemailer Transporter
    const emailPort = parseInt(process.env.EMAIL_PORT, 10) || 587;
    const isSecure = process.env.EMAIL_SECURE === 'true' || emailPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: emailPort,
      secure: isSecure, // false for port 587, true for port 465
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const cleanName = sanitizeString(name.trim());
    const cleanEmail = email.trim();
    const cleanSubject = sanitizeString(subject.trim());
    const cleanMessage = sanitizeString(message.trim());
    const formattedDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // 5. Email to Portfolio Owner
    const ownerMailOptions = {
      from: `"${cleanName} (Portfolio Contact)" <${emailUser}>`,
      to: contactReceiver,
      replyTo: cleanEmail,
      subject: `[Portfolio Contact] ${cleanSubject}`,
      text: `New message from your portfolio website:\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${formattedDate}\n\nMessage:\n${cleanMessage}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0818; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #623686;">
          <div style="background: linear-gradient(135deg, #623686, #801f95); padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #ffffff; font-size: 24px;">New Portfolio Contact Message</h2>
            <p style="margin: 6px 0 0 0; color: #e9d5ff; font-size: 14px;">Submitted through your website contact form</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #c770f0; font-weight: bold; width: 90px;">From:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #ffffff;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #c770f0; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #ffffff;">
                  <a href="mailto:${cleanEmail}" style="color: #c770f0; text-decoration: none;">${cleanEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #c770f0; font-weight: bold;">Subject:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #ffffff;">${cleanSubject}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #c770f0; font-weight: bold;">Time:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #2d1950; color: #9ca3af; font-size: 13px;">${formattedDate}</td>
              </tr>
            </table>

            <div style="margin-top: 15px;">
              <p style="color: #c770f0; font-weight: bold; margin-bottom: 8px;">Message:</p>
              <div style="background-color: #1b1a2e; border: 1px solid #3b205d; border-radius: 8px; padding: 16px; color: #f3e8ff; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">
${cleanMessage}
              </div>
            </div>

            <div style="margin-top: 25px; text-align: center;">
              <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)}"
                 style="display: inline-block; background-color: #623686; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">
                Reply Directly to ${cleanName}
              </a>
            </div>
          </div>
          <div style="background-color: #07040e; padding: 14px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #2d1950;">
            Sent automatically from your Portfolio Contact Form • Reply directly to respond to the sender
          </div>
        </div>
      `,
    };

    await transporter.sendMail(ownerMailOptions);

    // 6. Optional Confirmation Auto-Reply to Visitor
    if (process.env.SEND_VISITOR_CONFIRMATION !== 'false') {
      try {
        const visitorMailOptions = {
          from: `"Rishitha Rayapati" <${emailUser}>`,
          to: cleanEmail,
          subject: `Thank you for reaching out, ${cleanName}!`,
          text: `Hi ${cleanName},\n\nThank you for reaching out through my portfolio website! I have received your message regarding "${cleanSubject}" and will get back to you as soon as possible.\n\nBest regards,\nRishitha Rayapati\nComputer Science Engineering Student & Full-Stack Developer\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0818; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #623686;">
              <div style="background: linear-gradient(135deg, #623686, #801f95); padding: 24px; text-align: center;">
                <h2 style="margin: 0; color: #ffffff; font-size: 22px;">Message Received!</h2>
                <p style="margin: 6px 0 0 0; color: #e9d5ff; font-size: 14px;">Thank you for getting in touch</p>
              </div>
              <div style="padding: 24px; line-height: 1.6; color: #e5e7eb;">
                <p>Hi <strong style="color: #c770f0;">${cleanName}</strong>,</p>
                <p>Thank you for reaching out through my portfolio! This is an automated confirmation to let you know that I have received your message regarding: <em>"${cleanSubject}"</em>.</p>
                <p>I will review your message and reply as soon as possible.</p>
                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #2d1950;">
                  <p style="margin: 0; font-weight: bold; color: #ffffff;">Rishitha Rayapati</p>
                  <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px;">Aspiring Software Engineer & Full-Stack Developer</p>
                </div>
              </div>
            </div>
          `,
        };
        await transporter.sendMail(visitorMailOptions);
      } catch (confirmErr) {
        console.warn('[Warning] Could not send confirmation auto-reply:', confirmErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message due to a server error. Please try again later or email directly.',
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n=============================================`);
  console.log(` Portfolio Backend Server running on port ${PORT}`);
  console.log(` Contact Endpoint: POST http://localhost:${PORT}/api/contact`);
  console.log(` Health Check:     GET  http://localhost:${PORT}/api/health`);
  console.log(`=============================================\n`);
});
