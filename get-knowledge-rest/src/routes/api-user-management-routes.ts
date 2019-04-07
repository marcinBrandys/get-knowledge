let router = require('express').Router();
import {UserController} from "../controllers/user-controller";
const authService = require('../services/auth-service');

const userController = new UserController();

router.route('/login')
    .post(userController.login);

router.route('/users')
    .get(authService.validateUser, authService.requireAdmin, userController.getAll)
    .post(userController.register);

router.route('/user/by_id/:id')
    .get(authService.validateUser, authService.requireAdmin, userController.getUserById)
    .post(authService.validateUser, userController.updatePassword)
    .put(authService.validateUser, userController.updateData);

router.route('/user/me')
    .get(authService.validateUser, userController.getAccountInfo);

module.exports = router;