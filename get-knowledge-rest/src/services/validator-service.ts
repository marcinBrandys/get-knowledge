const generic_validator = require('validator');

const supportedGenders = ['male', 'female'];
const supportedRoles = ['admin', 'teacher', 'student'];
const supportedTaskTypes = ['T_01', 'T_02'];

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
    isTaskTypeValid(taskType: string) {
        return generic_validator.isIn(taskType, supportedTaskTypes);
    }
};

module.exports = validatorService;