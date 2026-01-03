const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const payrollRoutes = require('./routes/payroll.routes');
const documentRoutes = require('./routes/document.routes');
const departmentRoutes = require('./routes/department.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});



// Health check
app.get('/health', async (req, res) => {
    res.json({
        success: true,
        message: 'Dayflow HRMS API is running',
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        language: 'JavaScript',
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Dayflow HRMS API',
}));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Dayflow HRMS API',
        version: '2.0.0',
        stack: 'JavaScript + MongoDB',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        endpoints: {
            health: '/health',
            documentation: '/api-docs',
            auth: '/api/auth',
            employees: '/api/employees',
            attendance: '/api/attendance',
            leaves: '/api/leaves',
            payroll: '/api/payroll',
            documents: '/api/documents',
            departments: '/api/departments',
            dashboard: '/api/dashboard',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
    });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('🚀 Dayflow HRMS API Server');
            console.log('═══════════════════════════════════════════════════════════');
            console.log(`📍 Server: http://localhost:${PORT}`);
            console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
            console.log(`🏥 Health: http://localhost:${PORT}/health`);
            console.log(`💾 Database: MongoDB`);
            console.log(`⚙️  Language: JavaScript`);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');
            console.log('Available Features:');
            console.log('  🔐 Authentication & Authorization');
            console.log('  👥 Employee Management');
            console.log('  ⏰ Attendance Tracking (Check-in/out)');
            console.log('  🏖️  Leave Management');
            console.log('  💰 Payroll Management');
            console.log('  📄 Document Management');
            console.log('  🏢 Department Management');
            console.log('  📊 Dashboard & Analytics');
            console.log('  📧 Email Notifications (Nodemailer)');
            console.log('');
            console.log('Press Ctrl+C to stop');
            console.log('═══════════════════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
