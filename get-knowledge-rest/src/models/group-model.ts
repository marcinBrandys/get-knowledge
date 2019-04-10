const mongooseGroupModel = require('mongoose');
const groupSchema = mongooseGroupModel.Schema({
    groupName: {
        type: String,
        required: true
    },
    owner: {
        type: mongooseGroupModel.Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    students: [
        {
            type: mongooseGroupModel.Schema.Types.ObjectId, ref: 'user',
            require: false
        }
    ]
});

module.exports = mongooseGroupModel.model('group', groupSchema);
