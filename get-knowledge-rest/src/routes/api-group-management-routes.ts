let router = require('express').Router();
import {GroupController} from "../controllers/group-controller";
const authService = require('../services/auth-service');

const groupController = new GroupController();

router.route('/create')
    .post(authService.validateUser, authService.requireTeacher, groupController.createGroup);

module.exports = router;