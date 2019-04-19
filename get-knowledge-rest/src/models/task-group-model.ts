const mongooseTaskGroupModel = require('mongoose');
const taskGroupSchema = mongooseTaskGroupModel.Schema({
    taskGroupName: {
        type: String,
        required: true
    },
    owner: {
        type: mongooseTaskGroupModel.Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    isTestTaskGroup: {
        type: mongooseTaskGroupModel.Schema.Types.Boolean,
        require: true
    }
});

module.exports = mongooseTaskGroupModel.model('taskGroup', taskGroupSchema);
