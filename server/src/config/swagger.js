const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dayflow HRMS API',
            version: '1.0.0',
            description: 'Human Resource Management System API - JavaScript + MongoDB',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            { name: 'Authentication', description: 'User authentication endpoints' },
            { name: 'Employee Profile', description: 'Employee profile management' },
            { name: 'Attendance', description: 'Attendance tracking' },
            { name: 'Leave Management', description: 'Leave requests and approvals' },
            { name: 'Payroll', description: 'Salary and payroll management' },
            { name: 'Dashboard', description: 'Dashboard data' },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
