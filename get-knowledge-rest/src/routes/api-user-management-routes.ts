let router = require('express').Router();
import {UserController} from "../controllers/user-controller";

const userController = new UserController();

router.route('/login')
    .post(userController.login);

router.route('/users')
    .get(userController.getAll)
    .post(userController.register);

router.route('/user/by_id/:id')
    .get(userController.getUserById)
    .post(userController.updatePassword)
    .put(userController.updateData);

router.route('/user/me')
    .get(userController.getAccountInfo);

module.exports = router;