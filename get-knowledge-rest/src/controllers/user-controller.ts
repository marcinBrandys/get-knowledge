let User = require('../models/user-model');
let Solution = require('../models/solution-model');
let Task = require('../models/task-model');
let TaskGroup = require('../models/task-group-model');
const userControllerConfig = require('../config/config');
const cryptoService = require('../services/crypto-service');
const validatorService = require('../services/validator-service');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

export class UserController {
    getAll(req, res) {
        User.find({}).then(function (users) {
            res.json({
                users: users
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getStudents(req, res) {
        User.find({role: 'student'}).then(function (users) {
            res.json({
                students: users
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getUserById(req, res) {
        User.findOne({_id: req.params.id}).then(function (user) {
            res.json({
                user: user
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getAccountInfo(req, res) {
        const userId = _.get(req, 'body.userId');
        User.findOne({_id: userId}).then(function (user) {
            if (_.get(user, 'role') === 'student') {
                Solution.find({student: userId}).then(function (solutions) {
                    let points: number = 0;
                    let correctSolutions: number = 0;
                    let invalidSolutions: number = 0;
                    let durationOfAllSolutions: number = 0;
                    for (let solution of solutions) {
                        const isSolutionCorrect: boolean = _.get(solution, 'isCorrect', false);
                        const solutionPoints: number = _.get(solution, 'points', 0);
                        const solutionDuration: number = _.get(solution, 'duration', 0);
                        isSolutionCorrect ? correctSolutions++ : invalidSolutions++;
                        points += solutionPoints;
                        durationOfAllSolutions += solutionDuration;
                    }
                    let allSolutions: number = correctSolutions + invalidSolutions;
                    let avgSolutionDuration: number = allSolutions > 0 ? Math.round(durationOfAllSolutions/allSolutions) : null;

                    Task.find({}).then(function (tasks) {
                        const numberOfAllAvailableTasks: number = _.get(tasks, 'length', 0);

                        TaskGroup.find({}).then(function (taskGroups) {
                            let numberOfTaskGroups: number = 0;
                            let numberOfTests: number = 0;

                            for (let taskGroup of taskGroups) {
                                const isTestTaskGroup = _.get(taskGroup, 'isTestTaskGroup', false);
                                isTestTaskGroup ? numberOfTests++ : numberOfTaskGroups++;
                            }

                            res.json({
                                user: user,
                                stats: {
                                    points: points,
                                    correctSolutions: correctSolutions,
                                    invalidSolutions: invalidSolutions,
                                    allSolutions: allSolutions,
                                    avgSolutionDuration: avgSolutionDuration,
                                    numberOfAllAvailableTasks: numberOfAllAvailableTasks,
                                    numberOfTaskGroups: numberOfTaskGroups,
                                    numberOfTests: numberOfTests
                                }
                            });
                        }).catch(function () {
                            res.json({
                                user: user,
                                stats: {
                                    points: points,
                                    correctSolutions: correctSolutions,
                                    invalidSolutions: invalidSolutions,
                                    allSolutions: allSolutions,
                                    avgSolutionDuration: avgSolutionDuration,
                                    numberOfAllAvailableTasks: numberOfAllAvailableTasks
                                }
                            });
                        });
                    }).catch(function () {
                        res.json({
                            user: user,
                            stats: {
                                points: points,
                                correctSolutions: correctSolutions,
                                invalidSolutions: invalidSolutions,
                                allSolutions: allSolutions,
                                avgSolutionDuration: avgSolutionDuration
                            }
                        });
                    });
                }).catch(function () {
                    res.json({
                        user: user
                    });
                });
            } else {
                res.json({
                    user: user
                });
            }
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    updateData(req, res) {
        User.findOne({_id: req.body.userId}).then(function (user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.save().then(function () {
                res.json({
                    data: user
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

    updatePassword(req, res) {
        User.findOne({_id: req.body.userId}).then(function (user) {
            user.password = cryptoService.hashPassword(req.body.password);
            user.save().then(function () {
                res.json({
                    data: user
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

    register(req, res) {
        const firstName = _.get(req, 'body.firstName');
        const lastName = _.get(req, 'body.lastName');
        const nick = _.get(req, 'body.nick');
        const email = _.get(req, 'body.email');
        const password = _.get(req, 'body.password');
        const gender = _.get(req, 'body.gender');
        const age = _.get(req, 'body.age');
        const role = _.get(req, 'body.role');
        const accessCode = _.get(req, 'body.accessCode');

        if (validatorService.isEmailValid(email) && validatorService.isGenderValid(gender) && validatorService.isRoleValid(role) && validatorService.isAccessCodeValid(role, accessCode)) {

            let user = new User({
                firstName: firstName,
                lastName: lastName,
                nick: nick,
                email: email,
                password: cryptoService.hashPassword(password),
                gender: gender,
                age: age,
                role: role
            });

            user.save().then(function () {
                res.json({
                    data: user
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
                error: 'invalid user data'
            });
        }
    }

    login(req, res) {
        User.findOne({email: req.body.email}).select('+password').then(function (user) {
            if (cryptoService.comparePassword(req.body.password, user.password)) {
                const token = jwt.sign(
                    {
                        user: {
                            id: user._id,
                            role: user.role,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            nick: user.nick,
                            email: user.email,
                            gender: user.gender,
                            age: user.age
                        }
                    },
                    userControllerConfig.SECRET_KEY_JWT,
                    {
                        expiresIn: userControllerConfig.SESSION_DURATION
                    }
                );
                res.json({
                    token: token
                });
            } else {
                res.statusCode = 401;
                res.json({
                    error: 'wrong credentials'
                });
            }
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }
}