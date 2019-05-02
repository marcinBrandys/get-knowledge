let router = require('express').Router();
import {UserController} from "../controllers/user-controller";
const authService = require('../services/auth-service');

const userController = new UserController();

router.route('/login')
    .post(userController.login);

router.route('/users')
    .get(authService.validateUser, authService.requireTeacher, userController.getAll)
    .post(userController.register);

router.route('/students')
    .get(authService.validateUser, authService.requireTeacher, userController.getStudents);

router.route('/user/by_id/:id')
    .get(authService.validateUser, authService.requireAdmin, userController.getUserById);

router.route('/user/me')
    .get(authService.validateUser, userController.getAccountInfo);

router.route('/ranking')
    .get(authService.validateUser, userController.getRanking);

router.route('/private_ranking')
    .get(authService.validateUser, userController.getPrivateRanking);

module.exports = router;