# 💼 Employee Salary Tracker – Backend (API)

This is the backend API of the **Employee Salary Tracker App**, built using Node.js and Express. It handles user management, salary status tracking, authentication, and email notifications.

## 🔗 API Base URL
➡️ [Render Deployment URL](https://employee-salary-backend.onrender.com)  


## ⚙️ Tech Stack
- Node.js
- Express
- Nodemailer (for emails)
- JSON File Storage (no database)
- Hosted on: **Render**

## 📁 API Endpoints

### 🔐 Auth
- `POST /api/auth/login` – Login (admin/user)
- `POST /api/auth/change-password` – Change password

### 🧑 Admin
- `POST /api/admin/create-user` – Create user (max 6)
- `GET /api/admin/list-users` – List all users
- `POST /api/admin/set-salary` – Set user salary status
- `POST /api/admin/reset` – Reset all users (keeps admin only)

### 👤 User
- `GET /api/user/status/:username` – Get salary status by username

## ✉️ Email Notification
- Sends welcome email when new user is created via Nodemailer (Gmail service)

## 🧪 How to Run Locally

```bash
# Clone the backend repo
git clone https://github.com/lakshmidesikan/employee-salary-backend.git
cd employee-salary-backend

# Install dependencies
npm install

# Start server
node index.js
