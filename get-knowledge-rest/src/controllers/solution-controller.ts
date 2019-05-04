let Solution = require('../models/solution-model');
let Task = require('../models/task-model');
const validatorService = require('../services/validator-service');
const _ = require('lodash');

export class SolutionController {
    getSolutions(req, res) {
        Solution.find({}).then(function (solutions) {
            res.json({
                solutions: solutions
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getStudentSolutions(req, res) {
        const studentId = _.get(req, 'params.studentId');
        Solution.find({student: studentId}).then(function (solutions) {
            res.json({
                solutions: solutions
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    saveSolution(req, res) {
        const studentId = req.body.userId;
        const taskId = _.get(req, 'body.taskId');
        const startTs = _.get(req, 'body.startTs');
        const endTs = _.get(req, 'body.endTs');
        const answer = _.get(req, 'body.answer', 'none');
        const isTipUsed = _.get(req, 'body.isTipUsed', false);

        if (taskId && startTs && endTs && answer) {

            Task.findOne({_id: taskId}).populate({path: 'taskGroup'}).then(function (task) {

                const isTestTask: boolean = _.get(task, 'taskGroup.isTestTaskGroup', false);
                const testStartTs: number = _.get(task, 'taskGroup.startTs', null);
                const testEndTs: number = _.get(task, 'taskGroup.endTs', null);
                const taskCorrectSolution: string = _.get(task, 'taskCorrectSolution', 'undefined');

                const duration = endTs - startTs;
                const isCorrect = taskCorrectSolution.toLowerCase() === answer.toLowerCase();
                const points = isCorrect ? task.taskPoints : 0;
                const weight = task.taskWeight;
                let isTipAvailable = _.get(task, 'taskTip.length', 0) > 0;

                let solution = new Solution({
                    student: studentId,
                    task: taskId,
                    startTs: startTs,
                    endTs: endTs,
                    duration: duration,
                    answer: answer,
                    isCorrect: isCorrect,
                    points: points,
                    weight: weight,
                    isTipAvailable: isTipAvailable,
                    isTipUsed: isTipUsed
                });

                const currentTs: number = +new Date();

                if (!isTestTask
                    || (isTestTask && testStartTs && testEndTs && currentTs < testEndTs && currentTs >= testStartTs)) {

                    solution.save().then(function (result) {
                        res.json({
                            solution: result
                        });
                    }).catch(function (error) {
                        res.statusCode = 400;
                        res.json({
                            error: error
                        });
                    });
                } else {
                    res.statusCode = 409;
                    res.json({
                        error: 'timeout'
                    });
                }
            }).catch(function (error) {
                res.statusCode = 400;
                res.json({
                    error: error
                });
            });
        } else {
            res.statusCode = 400;
            res.json({
                error: 'invalid solution data'
            });
        }
    }
}