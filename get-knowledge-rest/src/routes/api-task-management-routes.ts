import {TaskController} from "../controllers/task-controller";
let router = require('express').Router();
const authService = require('../services/auth-service');

const taskController = new TaskController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, taskController.createTask);

router.route('/task/:taskGroup/:taskType')
    .get(authService.validateUser, taskController.getTask);

module.exports = router;