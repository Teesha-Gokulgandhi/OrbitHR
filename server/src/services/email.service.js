const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async loadTemplate(templateName, data) {
        try {
            const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
            const templateContent = await fs.readFile(templatePath, 'utf-8');
            const template = handlebars.compile(templateContent);
            return template(data);
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            // Return simple text if template fails
            return this.getSimpleTemplate(templateName, data);
        }
    }

    getSimpleTemplate(type, data) {
        const templates = {
            welcome: `
        <h2>Welcome to Dayflow HRMS!</h2>
        <p>Hi ${data.name},</p>
        <p>Your account has been successfully created.</p>
        <p>Employee ID: ${data.employee_id}</p>
        <p>Best regards,<br>Dayflow Team</p>
      `,
            'leave-approved': `
        <h2>Leave Request Approved</h2>
        <p>Hi ${data.name},</p>
        <p>Your leave request from ${data.start_date} to ${data.end_date} has been approved.</p>
        <p>Comments: ${data.comments || 'None'}</p>
        <p>Best regards,<br>Dayflow HR</p>
      `,
            'leave-rejected': `
        <h2>Leave Request Rejected</h2>
        <p>Hi ${data.name},</p>
        <p>Your leave request from ${data.start_date} to ${data.end_date} has been rejected.</p>
        <p>Reason: ${data.comments || 'Not specified'}</p>
        <p>Best regards,<br>Dayflow HR</p>
      `,
            'attendance-reminder': `
        <h2>Attendance Reminder</h2>
        <p>Hi ${data.name},</p>
        <p>Please don't forget to mark your attendance for today.</p>
        <p>Date: ${data.date}</p>
        <p>Best regards,<br>Dayflow HRMS</p>
      `,
            'salary-slip': `
        <h2>Salary Payment Notification</h2>
        <p>Hi ${data.name},</p>
        <p>Your salary for ${data.month} has been credited to your account.</p>
        <p>Net Amount: ₹${data.amount}</p>
        <p>Best regards,<br>Dayflow Payroll</p>
      `,
        };
        return templates[type] || '<p>Notification from Dayflow HRMS</p>';
    }

    async sendEmail({ to, subject, templateName, data }) {
        try {
            const html = await this.loadTemplate(templateName, data);

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'Dayflow HRMS <noreply@dayflow.com>',
                to,
                subject,
                html,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service is ready');
            return true;
        } catch (error) {
            console.error('❌ Email service error:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();
