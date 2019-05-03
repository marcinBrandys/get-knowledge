let router = require('express').Router();
import {TaskGroupController} from "../controllers/task-group-controller";
const authService = require('../services/auth-service');

const taskGroupController = new TaskGroupController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, taskGroupController.createTaskGroup);

router.route('/task-groups')
    .get(authService.validateUser, authService.requireTeacher, taskGroupController.getTaskGroups);

router.route('/task-group/:id')
    .get(authService.validateUser, taskGroupController.getTaskGroup);

router.route('/student-task-groups')
    .get(authService.validateUser, taskGroupController.getStudentTaskGroups);

router.route('/tests/:currentTs')
    .get(authService.validateUser, taskGroupController.getTests);

router.route('/tests_result')
    .get(authService.validateUser, taskGroupController.getTestsResult);

module.exports = router;