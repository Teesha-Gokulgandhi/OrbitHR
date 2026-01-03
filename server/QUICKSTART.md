# Quick Start - Dayflow HRMS API (JavaScript + MongoDB)

## 🚀 Get Started in 3 Minutes

### Step 1: Install MongoDB (if needed)
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### Step 2: Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

### Step 3: Start the Server
```bash
cd /Users/devloperritesh/Dev-Action-2026/HRMS/server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Dayflow HRMS API Server
📍 Server: http://localhost:3000
📚 API Docs: http://localhost:3000/api-docs
💾 Database: MongoDB
⚙️  Language: JavaScript
```

### Step 4: Test the API

Open: **http://localhost:3000/api-docs**

Try these steps:
1. **Sign Up** - Create a test user
2. **Sign In** - Get your JWT token
3. **Click "Authorize"** - Paste the token
4. **Test /api/auth/me** - Verify authentication works

## 🎯 Sample API Calls

### Create Admin User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "ADMIN001",
    "email": "admin@dayflow.com",
    "password": "Admin@123456",
    "role": "ADMIN"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dayflow.com",
    "password": "Admin@123456"
  }'
```

## ✅ Verification Checklist

- [ ] MongoDB is running (`mongosh` works)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Swagger UI accessible (http://localhost:3000/api-docs)
- [ ] Can sign up a new user
- [ ] Can sign in and receive JWT token
- [ ] Can access /api/auth/me with token

## 🆘 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongodb      # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongodb           # Linux
```

### Port Already in Use
Change PORT in `.env`:
```env
PORT=3001
```

### Module Not Found
```bash
npm install
```

## 📚 What's Working

✅ **Core Features**:
- User registration and authentication
- JWT token generation
- MongoDB database connection
- Swagger API documentation
- Express.js REST API
- Role-based access control
- Password hashing and validation

🔄 **Next Steps**:
- Add more controllers (attendance, leave, payroll, etc.)
- Expand API endpoints
- Add more features as needed

---

**Stack**: JavaScript + MongoDB + Express  
**Documentation**: http://localhost:3000/api-docs
