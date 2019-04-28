const mongooseTaskModel = require('mongoose');
const taskSchema = mongooseTaskModel.Schema({
    taskTitle: {
        type: String,
        required: true
    },
    taskGroup: {
        type: mongooseTaskModel.Schema.Types.ObjectId, ref: 'taskGroup',
        require: true
    },
    taskType: {
        type: String,
        required: true
    },
    owner: {
        type: mongooseTaskModel.Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    creationTs: {
        type: mongooseTaskModel.Schema.Types.Number,
        require: true
    },
    taskContent: {
        type: String,
        require: true
    },
    taskTip: {
        type: String,
        require: false
    },
    taskPresentedValue: {
        type: String,
        require: true
    },
    taskCorrectSolution: {
        type: String,
        require: true
    },
    taskWeight: {
        type: mongooseTaskModel.Schema.Types.Number,
        require: true
    },
    taskPoints: {
        type: mongooseTaskModel.Schema.Types.Number,
        require: true
    }
});

module.exports = mongooseTaskModel.model('task', taskSchema);
