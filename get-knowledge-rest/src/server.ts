const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appConfig = require('./config/config');
const userManagementRoutes = require('./routes/api-user-management-routes');
const groupManagementRoutes = require('./routes/api-group-management-routes');

mongoose.connect(appConfig.DB_PATH, {
        useNewUrlParser: true, useCreateIndex: true
    }).then(function () {
        console.log('successfully connected with mongodb');
    }).catch(function (error) {
        console.log('mongodb connection error:', error);
    });
const db = mongoose.connection;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use('/api/user-management', userManagementRoutes);
app.use('/api/group-management', groupManagementRoutes);

app.listen(appConfig.PORT, function () {
    console.log('app is working')
});
