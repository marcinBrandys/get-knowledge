import {type} from "os";

let User = require('../models/user-model');
let Solution = require('../models/solution-model');
let Task = require('../models/task-model');
let TaskGroup = require('../models/task-group-model');
let Group = require('../models/group-model');
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
        const studentCurrentTs: number = _.get(req, 'params.currentTs', null);

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

                    TaskGroup.find({}).then(function (taskGroups) {
                        let numberOfTaskGroups: number = 0;
                        let numberOfTests: number = 0;

                        for (let taskGroup of taskGroups) {
                            const isTestTaskGroup: boolean = _.get(taskGroup, 'isTestTaskGroup', false);
                            if (isTestTaskGroup) {
                                const startTs: number = _.get(taskGroup, 'startTs', null);
                                const endTs: number = _.get(taskGroup, 'endTs', null);
                                if (startTs && endTs && studentCurrentTs && studentCurrentTs >= startTs && studentCurrentTs < endTs) {
                                    numberOfTests++;
                                }
                            } else {
                                numberOfTaskGroups++;
                            }
                        }

                        res.json({
                            user: user,
                            stats: {
                                points: points,
                                correctSolutions: correctSolutions,
                                invalidSolutions: invalidSolutions,
                                allSolutions: allSolutions,
                                avgSolutionDuration: avgSolutionDuration,
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

    getRanking(req, res) {
        User.find({role: 'student'}).then(function (students) {

            Solution.find({}).then(function (solutions) {

                Group.find({}).populate({path: 'students'}).then(function (groups) {

                    let ranking = [];

                    for (let student of students) {
                        let studentId: string = _.get(student, '_id', null);
                        let studentNick = _.get(student, 'nick', '');
                        let studentPoints: number = 0;
                        let numberOfStudentSolutions: number = 0;
                        let numberOfStudentCorrectSolutions: number = 0;
                        let numberOfStudentInvalidSolutions: number = 0;
                        let avgStudentSolutionDuration: number = 0;
                        for (let solution of solutions) {
                            let solutionStudentId: string = _.get(solution, 'student', null);
                            if (_.isEqual(studentId, solutionStudentId)) {
                                const solutionPoints: number = _.get(solution, 'points', 0);
                                const isSolutionCorrect: boolean = _.get(solution, 'isCorrect', false);
                                const solutionDuration: number = _.get(solution, 'duration', 0);
                                studentPoints += solutionPoints;
                                numberOfStudentSolutions++;
                                isSolutionCorrect ? numberOfStudentCorrectSolutions++ : numberOfStudentInvalidSolutions++;
                                avgStudentSolutionDuration += solutionDuration;
                            }
                        }
                        if (numberOfStudentSolutions > 0) {
                            avgStudentSolutionDuration = Math.round(avgStudentSolutionDuration / numberOfStudentSolutions);
                        } else {
                            avgStudentSolutionDuration = 0;
                        }
                        let studentGroupNames: string[] = [];
                        for (let group of groups) {
                            const groupStudents: [] = _.get(group, 'students', []);
                            for (let studentOfGroup of groupStudents) {
                                const studentOfGroupId: string = _.get(studentOfGroup, '_id', null);
                                if (_.isEqual(studentId, studentOfGroupId)) {
                                    const groupName: string = _.get(group, 'groupName', '');
                                    studentGroupNames.push(groupName);
                                }
                            }
                        }
                        let rankItem = {
                            studentNick: studentNick,
                            studentGroupNames: studentGroupNames.join(', '),
                            studentPoints: studentPoints,
                            numberOfStudentSolutions: numberOfStudentSolutions,
                            numberOfStudentCorrectSolutions: numberOfStudentCorrectSolutions,
                            numberOfStudentInvalidSolutions: numberOfStudentInvalidSolutions,
                            avgStudentSolutionDuration: avgStudentSolutionDuration
                        };
                        ranking.push(rankItem);
                    }
                    ranking = _.orderBy(ranking, ['studentPoints', 'avgStudentSolutionDuration'], ['desc', 'asc']);

                    res.json({
                        ranking: ranking
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
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getPrivateRanking(req, res) {
        const userId = req.body.userId;
        const userRole = req.body.userRole;
        let groupQuery = {};
        if (userRole === 'teacher') {
            groupQuery['owner'] = userId;
        }
        Group.find(groupQuery).populate({path: 'students'}).then(function (groups) {

            let filteredGroup = _.cloneDeep(groups);
            if (userRole === 'student') {
                filteredGroup = [];
                for (let group of groups) {
                    const groupStudents: [] = _.get(group, 'students', []);
                    for (let studentOfGroup of groupStudents) {
                        const studentOfGroupId: string = _.get(studentOfGroup, 'id', null);
                        if (_.isEqual(userId, studentOfGroupId)) {
                            filteredGroup.push(group);
                        }
                    }
                }
            }

            Solution.find({}).then(function (solutions) {

                let ranking = [];

                for (let group of filteredGroup) {
                    const students: [] = _.get(group, 'students', []);
                    let groupRanking: object[] = [];
                    for (let student of students) {
                        let studentId: string = _.get(student, 'id', null);
                        let studentNick = _.get(student, 'nick', '');
                        let studentPoints: number = 0;
                        let numberOfStudentSolutions: number = 0;
                        let numberOfStudentCorrectSolutions: number = 0;
                        let numberOfStudentInvalidSolutions: number = 0;
                        let avgStudentSolutionDuration: number = 0;
                        for (let solution of solutions) {
                            let solutionStudentId: string = _.get(solution, 'student', null);
                            if (_.isEqual(studentId, solutionStudentId.toString())) {
                                const solutionPoints: number = _.get(solution, 'points', 0);
                                const isSolutionCorrect: boolean = _.get(solution, 'isCorrect', false);
                                const solutionDuration: number = _.get(solution, 'duration', 0);
                                studentPoints += solutionPoints;
                                numberOfStudentSolutions++;
                                isSolutionCorrect ? numberOfStudentCorrectSolutions++ : numberOfStudentInvalidSolutions++;
                                avgStudentSolutionDuration += solutionDuration;
                            }
                        }
                        if (numberOfStudentSolutions > 0) {
                            avgStudentSolutionDuration = Math.round(avgStudentSolutionDuration / numberOfStudentSolutions);
                        } else {
                            avgStudentSolutionDuration = 0;
                        }
                        groupRanking.push({
                            studentNick: studentNick,
                            studentPoints: studentPoints,
                            numberOfStudentSolutions: numberOfStudentSolutions,
                            numberOfStudentCorrectSolutions: numberOfStudentCorrectSolutions,
                            numberOfStudentInvalidSolutions: numberOfStudentInvalidSolutions,
                            avgStudentSolutionDuration: avgStudentSolutionDuration
                        });
                    }
                    groupRanking = _.orderBy(groupRanking, ['studentPoints', 'avgStudentSolutionDuration'], ['desc', 'asc']);
                    ranking.push({
                        groupName: _.get(group, 'groupName', ''),
                        ranking: groupRanking
                    });
                }

                res.json({
                    ranking: ranking
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
        const nick = _.get(req, 'body.nick');
        const password = _.get(req, 'body.password');
        const gender = _.get(req, 'body.gender');
        const age = _.get(req, 'body.age');
        const role = _.get(req, 'body.role');
        const accessCode = _.get(req, 'body.accessCode');

        if (nick && validatorService.isGenderValid(gender) && validatorService.isRoleValid(role) && validatorService.isAccessCodeValid(role, accessCode)) {

            let user = new User({
                nick: nick,
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
        User.findOne({nick: req.body.nick}).select('+password').then(function (user) {
            if (cryptoService.comparePassword(req.body.password, user.password)) {
                const token = jwt.sign(
                    {
                        user: {
                            id: user._id,
                            role: user.role,
                            nick: user.nick,
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