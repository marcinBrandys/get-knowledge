let User = require('../models/user-model');
const userControllerConfig = require('../config/config');
const cryptoService = require('../services/crypto-service');
const validatorService = require('../services/validator-service');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

export class UserController {
    getAll(req, res) {
        User.find({}).then(function (users) {
            res.send(users);
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
        if (req.headers['x-access-token']) {
            try {
                const decoded = jwt.verify(req.headers['x-access-token'], userControllerConfig.SECRET_KEY_JWT);

                User.findOne({_id: decoded.id}).then(function (user) {
                    res.json({
                        user: user
                    });
                }).catch(function (error) {
                    res.statusCode = 400;
                    res.json({
                        error: error
                    });
                });
            } catch(err) {
                res.statusCode = 401;
                res.json({
                    error: 'not auth'
                });
            }
        } else {
            res.statusCode = 401;
            res.json({
                error: 'not auth'
            });
        }
    }

    updateData(req, res) {
        User.findOne({_id: req.params.id}).then(function (user) {
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
        User.findOne({_id: req.params.id}).then(function (user) {
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

        if (validatorService.isEmailValid(email) && validatorService.isGenderValid(gender) && validatorService.isRoleValid(role)) {
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
                        id: user._id,
                        role: user.role
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