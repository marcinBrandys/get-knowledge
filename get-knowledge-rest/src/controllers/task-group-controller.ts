import {start} from "repl";

let TaskGroup = require('../models/task-group-model');
let Solution = require('../models/solution-model');
let Task = require('../models/task-model');
let Group = require('../models/group-model');
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

    getTaskGroup(req, res) {
        const taskGroupId: string = _.get(req, 'params.id', null);

        TaskGroup.findOne({_id: taskGroupId}).then(function (taskGroup) {
            res.json({
                taskGroup: taskGroup
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

    getTests(req, res) {
        const studentCurrentTs: number = _.get(req, 'params.currentTs', null);
        const userId: string = _.get(req, 'body.userId', null);
        const userRole: string = _.get(req, 'body.userRole', null);
        let query = {};
        if (userRole && userRole === 'teacher') {
            query['owner'] = userId;
        }

        TaskGroup.find(query).then(function (taskGroups) {
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

    getTestsResult(req, res) {
        const userId: string = _.get(req, 'body.userId', null);
        const userRole: string = _.get(req, 'body.userRole', null);
        let query = {};
        if (userRole && userRole === 'teacher') {
            query['owner'] = userId;
            query['isTestTaskGroup'] = true;


            TaskGroup.find(query).then(function (taskGroups) {
                Group.find({owner: userId}).populate({path: 'students'}).then(function (groups) {
                    Solution
                        .find({})
                        .populate([
                            {path: 'task', populate: {path: 'taskGroup'}},
                            {path: 'student'}
                        ])
                        .then(function (solutions) {
                            Task.find({}).then(function (tasks) {

                                let tests = [];
                                const currentTs: number = +new Date();

                                for (let test of taskGroups) {
                                    const testId = _.get(test, '_id');
                                    let numberOfTasks: number = 0;
                                    let maxPoints: number = 0;
                                    const startTs = _.get(test, 'startTs');
                                    const endTs = _.get(test, 'endTs');
                                    let results = [];
                                    if (testId && startTs && endTs && currentTs > endTs) {
                                        for (let task of tasks) {
                                            const taskGroup: string = _.get(task, 'taskGroup', null);
                                            if (taskGroup && _.isEqual(testId.toString(), taskGroup.toString())) {
                                                const taskPoints: number = _.get(task, 'taskPoints', 0);
                                                numberOfTasks++;
                                                maxPoints += taskPoints;
                                            }
                                        }

                                        for (let group of groups) {

                                            const groupStudents = _.get(group, 'students', []);
                                            const groupName = _.get(group, 'groupName');
                                            let result = {
                                                groupName: groupName,
                                                studentsResults: []
                                            };

                                            for (let student of groupStudents) {

                                                const studentId = _.get(student, '_id');
                                                let testPoints: number = 0;
                                                let testCorrectSolutions: number = 0;
                                                let testWrongSolutions: number = 0;
                                                for (let solution of solutions) {
                                                    const taskGroupId: string = _.get(solution, 'task.taskGroup.id', null);
                                                    const solutionOwnerId: string = _.get(solution, 'student.id');
                                                    if (_.isEqual(testId.toString(), taskGroupId.toString())
                                                        && _.isEqual(studentId.toString(), solutionOwnerId.toString())) {

                                                        const isCorrect: boolean = _.get(solution, 'isCorrect', false);
                                                        const points: number = _.get(solution, 'points', 0);
                                                        if (isCorrect) {
                                                            testPoints += points;
                                                            testCorrectSolutions++;
                                                        } else {
                                                            testWrongSolutions++;
                                                        }
                                                    }
                                                }

                                                result.studentsResults.push({
                                                    student: student,
                                                    testPoints: testPoints,
                                                    testCorrectSolutions: testCorrectSolutions,
                                                    testWrongSolutions: testWrongSolutions,
                                                    numberOfTasks: numberOfTasks,
                                                    maxPoints: maxPoints,
                                                    percent: maxPoints > 0 ? ((testPoints/maxPoints) * 100).toFixed(2) : '0.00'
                                                });
                                            }
                                            result.studentsResults = _.orderBy(result.studentsResults, 'testPoints', ['desc']);
                                            results.push(result);
                                        }
                                        tests.push({
                                            test: test,
                                            results: results
                                        })
                                    }
                                }

                                res.json({
                                    result: tests
                                })
                            }).catch(function (error) {
                                res.statusCode = 400;
                                res.json({
                                    error: error
                                });
                            })
                    }).catch(function (error) {
                        res.statusCode = 400;
                        res.json({
                            error: error
                        });
                    })
                }).catch(function (error) {
                    res.statusCode = 400;
                    res.json({
                        error: error
                    });
                });
            }).catch(function (error) {
                res.statusCode = 400;
                res.json({
                    error: error
                });
            });

        } else {
            Solution
                .find({student: userId})
                .populate({path: 'task', populate: {path: 'taskGroup'}}).then(function (solutions) {

                let uniqueTests = [];
                let uniqueTestsIds = [];
                let testSolutions = [];
                let tests = [];
                const currentTs: number = +new Date();

                for (let solution of solutions) {
                    const isTestSolution: boolean = _.get(solution, 'task.taskGroup.isTestTaskGroup', false);
                    const taskGroup = _.get(solution, 'task.taskGroup', null);
                    const taskGroupId: string = _.get(solution, 'task.taskGroup.id', null);
                    const taskGroupStartTs: number = _.get(solution, 'task.taskGroup.startTs', null);
                    const taskGroupEndTs: number = _.get(solution, 'task.taskGroup.endTs', null);
                    if (taskGroup && isTestSolution
                        && taskGroupStartTs && taskGroupEndTs
                        && currentTs > taskGroupEndTs) {

                        uniqueTests.push(taskGroup);
                        uniqueTestsIds.push(taskGroupId.toString());
                        testSolutions.push(solution);
                    }
                }

                uniqueTests = _.uniq(uniqueTests);

                Task.find({}).then(function (tasks) {

                    for (let test of uniqueTests) {
                        let testPoints: number = 0;
                        let testCorrectSolutions: number = 0;
                        let testWrongSolutions: number = 0;
                        let numberOfTasks: number = 0;
                        let maxPoints: number = 0;
                        const testId: string = _.get(test, 'id', null);
                        for (let solution of testSolutions) {
                            const taskGroupId: string = _.get(solution, 'task.taskGroup.id', null);
                            if (_.isEqual(testId.toString(), taskGroupId.toString())) {
                                const isCorrect: boolean = _.get(solution, 'isCorrect', false);
                                const points: number = _.get(solution, 'points', 0);
                                if (isCorrect) {
                                    testPoints += points;
                                    testCorrectSolutions++;
                                } else {
                                    testWrongSolutions++;
                                }
                            }
                        }
                        for (let task of tasks) {
                            const taskGroup: string = _.get(task, 'taskGroup', null);
                            if (taskGroup && _.isEqual(testId.toString(), taskGroup.toString())) {
                                const taskPoints: number = _.get(task, 'taskPoints', 0);
                                numberOfTasks++;
                                maxPoints += taskPoints;
                            }
                        }
                        tests.push({
                            test: test,
                            testPoints: testPoints,
                            testCorrectSolutions: testCorrectSolutions,
                            testWrongSolutions: testWrongSolutions,
                            numberOfTasks: numberOfTasks,
                            maxPoints: maxPoints,
                            percent: maxPoints > 0 ? ((testPoints/maxPoints) * 100).toFixed(2) : '0.00'
                        })
                    }

                    res.json({
                        result: tests
                    });

                }).catch(function (error) {
                    res.statusCode = 400;
                    res.json({
                        error: error
                    });
                });
            }).catch(function (error) {
                res.statusCode = 400;
                res.json({
                    error: error
                });
            });
        }
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