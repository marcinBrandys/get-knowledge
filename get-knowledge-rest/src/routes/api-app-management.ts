import {AppController} from "../controllers/app-controller";
let router = require('express').Router();

const appController = new AppController();

router.route('/status')
    .get(appController.getAppStatus);

router.route('/stats')
    .get(appController.getAppStats);

module.exports = router;