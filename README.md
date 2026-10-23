# Rishitha Rayapati | Portfolio

A personal developer portfolio showcasing my skills, projects, and experience as a Computer Science Engineering student. The portfolio includes a contact form powered by **Node.js, Express, and Nodemailer** to receive visitor inquiries directly by email.

## ✨ Features

- Responsive personal portfolio website
- Home, About, Projects, and Resume sections
- Developer skills and project showcase
- Contact form with email delivery using Nodemailer
- Server-side email configuration using environment variables
- Input validation and error handling
- Success and error feedback for contact form submissions
- Secure handling of email credentials

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5 and CSS3
- Bootstrap / existing UI libraries, if applicable

**Backend**
- Node.js
- Express.js
- Nodemailer

**Email Service**
- Gmail SMTP or another supported SMTP provider

## 📁 Project Structure

```text
portfolio/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── ...
├── server/
│   ├── server.js
│   ├── routes/
│   └── ...
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

*Note: The structure above is an example. Adjust it to match your actual project files.*

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd portfolio
```

Replace `<YOUR_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Install dependencies

Install the frontend dependencies from the project root:

```bash
npm install
```

If the backend has a separate `package.json`, install its dependencies too:

```bash
cd server
npm install
```

Install Nodemailer and Express in the backend only if they are not already installed:

```bash
npm install nodemailer express
```

### 3. Configure environment variables

Create a `.env` file in the backend directory, or the location expected by your server code.

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER=your_email@gmail.com
```

Replace the example values with your actual email configuration.

**Important security practices:**
- Never commit `.env` or real credentials to GitHub.
- Keep `.env` in `.gitignore`.
- Use `.env.example` to document required variable names with placeholder values.
- Never expose SMTP credentials in React components or browser code.

### 4. Configure Gmail SMTP

If you use Gmail:

1. Open your Google Account settings.
2. Enable 2-Step Verification.
3. Generate an App Password if your account is eligible.
4. Set the generated App Password as `EMAIL_PASS`.
5. Set `EMAIL_USER` and `CONTACT_RECEIVER` to the appropriate email addresses.

Do not use your regular Gmail password.

### 5. Run the application

Start the backend using the command configured in its `package.json`. For example:

```bash
cd server
npm start
```

Start the frontend in a separate terminal using its existing development command. For example:

```bash
npm start
```

If your frontend uses Vite, the command may instead be:

```bash
npm run dev
```

Use the commands defined in your actual project scripts.

## 📧 How the Contact Form Works

1. A visitor enters their name, email, subject, and message.
2. The frontend submits the form data to the backend contact API.
3. The backend validates the submitted information.
4. Nodemailer sends an email using the configured SMTP service.
5. The email arrives in the configured recipient inbox.
6. The frontend displays a success or error message.

The visitor's email address should be set as the reply-to address, allowing you to reply directly to their inquiry.

## 🌐 Deployment

### Frontend

Deploy the frontend to a platform such as Vercel or Netlify.

### Backend

Deploy the Node.js backend to a supported server hosting platform, or use a suitable serverless function.

Configure all required environment variables in the hosting platform's project settings.

Ensure the frontend's API URL points to the deployed backend and that the backend accepts requests from the correct frontend origin.

**Note:** A frontend deployed on Vercel does not automatically host a separate Express server. Use a supported Vercel Function or deploy the backend separately.

## 🧪 Testing

Before publishing, verify that:

- Valid contact form submissions are accepted.
- Emails arrive in the configured inbox.
- The reply-to address matches the visitor's email.
- Missing or invalid fields are rejected.
- SMTP failures produce appropriate error messages.
- Repeated submissions are appropriately rate-limited.
- Credentials are not exposed in browser code or repository history.

## 🔒 Security

- Store SMTP credentials in server-side environment variables.
- Validate and sanitize form inputs.
- Implement rate limiting and spam protection.
- Restrict cross-origin requests to trusted origins where appropriate.
- Avoid returning internal SMTP errors or credentials to visitors.
- Never log passwords or other secrets.

## 👩‍💻 Author

**Rishitha Rayapati**

Computer Science Engineering Student | Aspiring Software Developer

- GitHub: <YOUR_GITHUB_PROFILE_URL>
- LinkedIn: <YOUR_LINKEDIN_PROFILE_URL>

## 📄 License

Add the license applicable to your project if you intend to distribute or reuse the source code.
