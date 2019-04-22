import {TaskController} from "../controllers/task-controller";
let router = require('express').Router();
const authService = require('../services/auth-service');

const taskController = new TaskController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, taskController.createTask);

router.route('/task/:taskGroup/:selectTaskType')
    .get(authService.validateUser, taskController.getTask);

router.route('/tasks')
    .get(authService.validateUser, taskController.getTasks);

module.exports = router;