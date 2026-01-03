const { validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((error) => ({
                field: error.type === 'field' ? error.path : 'unknown',
                message: error.msg,
            })),
        });
    };
};

module.exports = { validate };
