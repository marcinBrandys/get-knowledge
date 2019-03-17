const generic_validator = require('validator');

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
    }
};

module.exports = validatorService;