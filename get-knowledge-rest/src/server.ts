const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
// const userManagementRoutes = require('./routes/api-user-management-routes');
// const groupManagementRoutes = require('./routes/api-group-management-routes');
// const taskGroupManagementRoutes = require('./routes/api-task-group-management-routes');
// const taskManagementRoutes = require('./routes/api-task-management-routes');
// const solutionManagementRoutes = require('./routes/api-solution-management-routes');

// mongoose.connect(appConfig.DB_PATH, {
//         useNewUrlParser: true, useCreateIndex: true
//     }).then(function () {
//         console.log('successfully connected with mongodb');
//     }).catch(function (error) {
//         console.log('mongodb connection error:', error);
//     });
// const db = mongoose.connection;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
// app.use('/api/user-management', userManagementRoutes);
// app.use('/api/group-management', groupManagementRoutes);
// app.use('/api/task-group-management', taskGroupManagementRoutes);
// app.use('/api/task-management', taskManagementRoutes);
// app.use('/api/solution-management', solutionManagementRoutes);

app.get('/status', function(req,res) {
    res.send('hello');
});

// app.listen(appConfig.PORT, function () {
//     console.log('app is working')
// });
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
// httpServer.listen(8080);
httpsServer.listen(8443);
