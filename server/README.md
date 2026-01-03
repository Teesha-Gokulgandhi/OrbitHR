# Dayflow HRMS API

> Every workday, perfectly aligned.

A comprehensive Human Resource Management System (HRMS) API built with **JavaScript**, **Express.js**, and **MongoDB**. Complete with Swagger/OpenAPI documentation.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access
- **Employee Management**: Profile management and directory
- **Attendance Tracking**: Check-in/check-out with time calculation
- **Leave Management**: Leave application and approval workflows
- **Payroll System**: Salary management
- **Dashboard Analytics**: Real-time insights
- **API Documentation**: Interactive Swagger UI

## 🛠️ Tech Stack

- **Runtime**: Node.js 16+
- **Language**: JavaScript (ES6+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🎯 Installation

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
Download from [MongoDB Official Site](https://www.mongodb.com/try/download/community)

### 2. Install Dependencies

```bash
cd /Users/devloperritesh/Dev-Action-2026/HRMS/server
npm install
```

### 3. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

The default configuration works for local development. Update if needed:
```env
MONGODB_URI=mongodb://localhost:27017/dayflow_hrms
JWT_SECRET=your_secure_secret_here
```

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Access the interactive Swagger documentation at:

**http://localhost:3000/api-docs**

## 🔑 Quick Start Guide

### 1. Create a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "email": "admin@dayflow.com",
    "password": "Admin@123",
    "role": "ADMIN"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dayflow.com",
    "password": "Admin@123"
  }'
```

Copy the returned JWT token.

### 3. Use Protected Endpoints
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user info

### Others
More endpoints will be available as modules are added.

## 🗄️ Database Schema

### Collections

1. **users** - User authentication
   - employee_id, email, password_hash, role

2. **employeeprofiles** - Employee information
   - Personal details, job information

3. **attendances** - Attendance records
   - Check-in/out times, status

4. **leaverequests** - Leave management
   - Leave types, dates, approval status

5. **payrolls** - Salary information
   - Salary components, deductions

6. **documents** - Employee documents
   - File metadata

## 🔐 User Roles

- **EMPLOYEE**: Access own data
- **HR**: Manage employees
- **ADMIN**: Full system access

## 🔧 Development

### Project Structure
```
server/
├── src/
│   ├── config/          # Database, Swagger config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, errors
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── index.js         # Main app
├── package.json
└── .env
```

### Scripts
- `npm run dev` - Start with nodemon (hot-reload)
- `npm start` - Start production server

## 🛡️ Security

- Bcrypt password hashing
- JWT authentication
- Role-based access control
- Input validation
- CORS protection

## 📄 License

MIT

---

**Stack**: JavaScript + MongoDB + Express  
**Version**: 2.0.0
