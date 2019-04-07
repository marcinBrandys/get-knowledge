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

    createGroup(req, res) {
        const groupName = _.get(req, 'body.groupName');
        const ownerId = req.body.userId;

        if (groupName) {
            let group = new Group({
                groupName: groupName,
                owner: ownerId
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
}