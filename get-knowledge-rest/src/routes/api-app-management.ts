import {AppController} from "../controllers/app-controller";
let router = require('express').Router();

const appController = new AppController();

router.route('/status')
    .post(appController.getAppStatus);

module.exports = router;