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
        TaskGroup.find({}).then(function (taskGroups) {
            let filteredTaskGroups = [];

            for (let taskGroup of taskGroups) {
                const isTestTaskGroup: boolean = _.get(taskGroup, 'isTestTaskGroup', false);
                if (!isTestTaskGroup) {
                    filteredTaskGroups.push(taskGroup);
                }
            }

            res.json({
                taskGroups: filteredTaskGroups
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getStudentTests(req, res) {
        const studentCurrentTs: number = _.get(req, 'params.currentTs', null);
        console.log(studentCurrentTs);

        TaskGroup.find({}).then(function (taskGroups) {
            console.log(taskGroups);
            let tests = [];

            for (let taskGroup of taskGroups) {
                const isTestTaskGroup: boolean = _.get(taskGroup, 'isTestTaskGroup', false);
                if (isTestTaskGroup) {
                    const startTs: number = _.get(taskGroup, 'startTs', null);
                    const endTs: number = _.get(taskGroup, 'endTs', null);
                    if (startTs && endTs && studentCurrentTs && studentCurrentTs >= startTs && studentCurrentTs < endTs) {
                        tests.push(taskGroup);
                    }
                }
            }
            console.log(tests);

            res.json({
                tests: tests
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
        const startTs = _.get(req, 'body.startTs');
        const endTs = _.get(req, 'body.endTs');
        const ownerId = req.body.userId;

        if (taskGroupName && ((!startTs && !endTs) || (startTs && endTs && endTs > startTs))) {
            let taskGroup = new TaskGroup({
                taskGroupName: taskGroupName,
                owner: ownerId,
                isTestTaskGroup: isTestTaskGroup,
                startTs: startTs,
                endTs: endTs
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