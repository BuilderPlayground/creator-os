# Creator OS

**Create freely. Operate boldly.**

Creator OS is a full-stack web application designed to simplify the business side of content creation.

Built around the idea of taking creators **from pitch to paycheck**, Creator OS helps users organize brand partnerships, manage opportunities, monitor deal progress, and track payments all from one workspace.

## Features

- **User authentication:** Create an account, sign in, and securely log out.
- **Personalized dashboard:** Access a workspace displaying your own brand partnerships.
- **Brand deal management:** Create, view, edit, and delete opportunities.
- **Opportunity tracking:** Organize campaign details, platforms, deal values, deadlines, and notes.
- **Deal pipeline:** Track opportunities through stages including Inquiry, Negotiating, Contracted, In Progress, and Completed.
- **Payment tracking:** Monitor invoice and payment statuses.
- **Dashboard metrics:** View total deals, pipeline value, and payments received.

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript
- EJS

**Backend**
- Node.js
- Express.js
- Passport.js

**Database**
- MongoDB Atlas

## Getting Started

### 1. Clone the repository

Clone the project to your local machine and open the project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project's root directory and add:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

Replace the placeholder values with your own configuration.

**Important:** Never commit your `.env` file or expose database credentials.

### 4. Start the application

```bash
node server.js
```

### 5. Open the application

Visit `localhost:8080` in your browser.

## Project Scope

This version of Creator OS focuses on authenticated brand partnership management, opportunity tracking, and payment visibility.

The broader product vision includes additional tools to help creators manage and grow their businesses.

## Acknowledgments

The authentication foundation was adapted from the Savage Auth starter project, which draws on Scotch.io's authentication tutorial.

---

**Creator OS — Your work. Your business. Your way.**