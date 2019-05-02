const mongooseUserModel = require('mongoose');
const userSchema = mongooseUserModel.Schema({
    nick: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: mongooseUserModel.Schema.Types.Number,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});

module.exports = mongooseUserModel.model('user', userSchema);
