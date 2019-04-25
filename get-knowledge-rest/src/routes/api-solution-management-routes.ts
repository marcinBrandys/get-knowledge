import {SolutionController} from "../controllers/solution-controller";

let router = require('express').Router();
const authService = require('../services/auth-service');

const solutionController = new SolutionController();

router.route('/solution')
    .post(authService.validateUser, solutionController.saveSolution);

router.route('/solutions')
    .get(solutionController.getSolutions);

module.exports = router;