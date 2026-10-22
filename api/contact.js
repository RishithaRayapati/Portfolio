const nodemailer = require('nodemailer');

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.trim().length <= 150;
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Portfolio Contact API on Vercel',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message, _gotcha, honeypot } = req.body || {};

    // 1. Spam check: Honeypot field inspection
    if (_gotcha || honeypot) {
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
      secure: isSecure,
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

    // 5. Send Email to Owner
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

    // 6. Optional Visitor Auto-Reply
    if (process.env.SEND_VISITOR_CONFIRMATION !== 'false') {
      try {
        await transporter.sendMail({
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
        });
      } catch (confirmErr) {
        console.warn('Auto-reply confirmation failed:', confirmErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message due to a server error. Please try again later or email directly.',
    });
  }
};
