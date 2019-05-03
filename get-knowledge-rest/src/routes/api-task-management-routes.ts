import {TaskController} from "../controllers/task-controller";
let router = require('express').Router();
const authService = require('../services/auth-service');

const taskController = new TaskController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, taskController.createTask);

router.route('/task/:taskGroup/:taskType')
    .get(authService.validateUser, taskController.getTask);

router.route('/test_tasks/:testId')
    .get(authService.validateUser, taskController.getTestTasks);

router.route('/tasks')
    .get(authService.validateUser, taskController.getTasks);

module.exports = router;