const generic_validator = require('validator');
const validatorConfig = require('../config/config');

const supportedGenders = ['male', 'female'];
const supportedRoles = ['admin', 'teacher', 'student'];

const validatorService = {
    isEmailValid(email: string) {
        return generic_validator.isEmail(email);
    },
    isGenderValid(gender: string) {
        return generic_validator.isIn(gender, supportedGenders);
    },
    isRoleValid(role: string) {
        return generic_validator.isIn(role, supportedRoles);
    },
    isAccessCodeValid(role: string, accessCode: string) {
        let isValid: boolean = true;
        if (role === 'teacher' && accessCode !== validatorConfig.ACCESS_CODE) {
            isValid = false;
        }

        return isValid;
    }
};

module.exports = validatorService;