const generic_validator = require('validator');
const validatorConfig = require('../config/config');

const supportedGenders = ['male', 'female'];
const supportedRoles = ['admin', 'teacher', 'student'];
const supportedTaskTypes = ['T_01', 'T_02', 'W_01', 'W_02', 'W_03', 'W_04', 'S_01', 'S_02'];

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