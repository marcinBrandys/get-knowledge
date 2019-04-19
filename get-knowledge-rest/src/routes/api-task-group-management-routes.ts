let router = require('express').Router();
import {TaskGroupController} from "../controllers/task-group-controller";
const authService = require('../services/auth-service');

const taskGroupController = new TaskGroupController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, taskGroupController.createTaskGroup);

router.route('/task-groups')
    .get(authService.validateUser, authService.requireTeacher, taskGroupController.getTaskGroups);

module.exports = router;