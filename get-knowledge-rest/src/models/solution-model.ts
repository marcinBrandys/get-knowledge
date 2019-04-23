const mongooseSolutionModel = require('mongoose');
const solutionSchema = mongooseSolutionModel.Schema({
    student: {
        type: mongooseSolutionModel.Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    task: {
        type: mongooseSolutionModel.Schema.Types.ObjectId, ref: 'task',
        require: true
    },
    startTs: {
        type: mongooseSolutionModel.Schema.Types.Number,
        require: true
    },
    endTs: {
        type: mongooseSolutionModel.Schema.Types.Number,
        require: true
    },
    duration: {
        type: mongooseSolutionModel.Schema.Types.Number,
        require: true
    },
    answer: {
        type: String,
        require: true
    },
    isCorrect: {
        type: mongooseSolutionModel.Schema.Types.Boolean,
        require: true
    },
    points: {
        type: mongooseSolutionModel.Schema.Types.Number,
        require: true
    },
    weight: {
        type: mongooseSolutionModel.Schema.Types.Number,
        require: true
    },
    isTipAvailable: {
        type: mongooseSolutionModel.Schema.Types.Boolean,
        require: true
    },
    isTipUsed: {
        type: mongooseSolutionModel.Schema.Types.Boolean,
        require: true
    }
});

module.exports = mongooseSolutionModel.model('solution', solutionSchema);
