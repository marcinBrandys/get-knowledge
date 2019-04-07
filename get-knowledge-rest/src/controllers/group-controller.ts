let Group = require('../models/group-model');
const _ = require('lodash');

export class GroupController {
    getAll(req, res) {
        Group.find({}).then(function (groups) {
            res.send(groups);
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getGroupById(req, res) {
        Group.findOne({_id: req.params.id}).then(function (group) {
            res.json({
                group: group
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getGroups(req, res) {
        Group.find({owner: req.body.userId}).then(function (groups) {
            res.json({
                groups: groups
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    getStudentsOfGroup(req, res) {
        Group.findOne({_id: req.params.id, owner: req.body.userId}).populate({path: 'students'}).then(function (group) {
            res.json({
                students: group.students
            });
        }).catch(function (error) {
            res.statusCode = 400;
            res.json({
                error: error
            });
        });
    }

    createGroup(req, res) {
        const groupName = _.get(req, 'body.groupName');
        const ownerId = req.body.userId;

        if (groupName) {
            let group = new Group({
                groupName: groupName,
                owner: ownerId,
                students: []
            });

            group.save().then(function () {
                res.json({
                    data: group
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
                error: 'invalid group data'
            });
        }
    }

    addStudentToGroup(req, res) {
        const studentId = _.get(req, 'body.studentId');

        Group.findOne({_id: req.params.id, owner: req.body.userId}).then(function (group) {
            group.students.addToSet(studentId);
            group.save().then(function () {
                res.json({
                    group: group
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