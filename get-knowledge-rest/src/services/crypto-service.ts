const bcrypt = require('bcrypt');
const cryptoConfig = require('../config/config');

const cryptoService = {
    hashPassword(password: string) {
        return bcrypt.hashSync(password, cryptoConfig.SALT_ROUNDS);
    },

    comparePassword(plainTextPassword: string, encryptedPassword: string) {
        return bcrypt.compareSync(plainTextPassword, encryptedPassword);
    }
};

module.exports = cryptoService;