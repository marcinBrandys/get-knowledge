let Task = require('../models/task-model');
const validatorService = require('../services/validator-service');
const _ = require('lodash');

export class TaskController {
    getTask(req, res) {
        const taskGroupName = _.get(req, 'params.taskGroup');
        const taskTypeName = _.get(req, 'params.taskType');

        Task.find({taskGroup: taskGroupName, taskType: taskTypeName}).then(function (tasks) {
            const task = _.sample(tasks);
            res.json({
                task: task
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getTasks(req, res) {
        Task.find({}).then(function (tasks) {
            res.json({
                tasks: tasks
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    createTask(req, res) {
        const taskTitle = _.get(req, 'body.taskTitle');
        const taskGroup = _.get(req, 'body.taskGroup');
        const taskType = _.get(req, 'body.taskType');
        const owner = _.get(req, 'body.userId');
        const creationTs = +new Date();
        const taskContent = _.get(req, 'body.taskContent');
        const taskPresentedValue = _.get(req, 'body.taskPresentedValue');
        const taskCorrectSolution = _.get(req, 'body.taskCorrectSolution');
        const taskWeight = _.get(req, 'body.taskWeight');
        const taskPoints = _.get(req, 'body.taskPoints');

        if (validatorService.isTaskTypeValid(taskType)) {
            let task = new Task({
                taskTitle: taskTitle,
                taskGroup: taskGroup,
                taskType: taskType,
                owner: owner,
                creationTs: creationTs,
                taskContent: taskContent,
                taskPresentedValue: taskPresentedValue,
                taskCorrectSolution: taskCorrectSolution,
                taskWeight: taskWeight,
                taskPoints: taskPoints
            });

            task.save().then(function () {
                res.json({
                    task: task
                });
            }).catch(function (error) {
                res.statusCode = 400;
                res.json({
                    error: error
                });
            });
        } else {
            res.statusCode = 400;
            res.json({
                error: 'invalid task data'
            });
        }
    }
}