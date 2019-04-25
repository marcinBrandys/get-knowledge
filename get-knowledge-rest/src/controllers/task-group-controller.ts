let TaskGroup = require('../models/task-group-model');
const _ = require('lodash');

export class TaskGroupController {
    getTaskGroups(req, res) {
        const ownerId = req.body.userId;

        TaskGroup.find({owner: ownerId}).then(function (taskGroups) {
            res.json({
                taskGroups: taskGroups
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getStudentTaskGroups(req, res) {
        const studentId = req.body.userId;

        TaskGroup.find({}).then(function (taskGroups) {
            res.json({
                taskGroups: taskGroups
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    createTaskGroup(req, res) {
        const taskGroupName = _.get(req, 'body.taskGroupName');
        const isTestTaskGroup = _.get(req, 'body.isTestTaskGroup');
        const ownerId = req.body.userId;

        if (taskGroupName) {
            let taskGroup = new TaskGroup({
                taskGroupName: taskGroupName,
                owner: ownerId,
                isTestTaskGroup: isTestTaskGroup
            });

            taskGroup.save().then(function () {
                res.json({
                    taskGroup: taskGroup
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
                error: 'invalid task group data'
            });
        }
    }
}