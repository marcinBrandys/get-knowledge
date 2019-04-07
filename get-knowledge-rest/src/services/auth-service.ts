const authConfig = require('../config/config');
const authJwt = require('jsonwebtoken');
const authService = {
    validateUser: function (req, res, next) {
        if (req.headers['x-access-token']) {
            authJwt.verify(req.headers['x-access-token'], authConfig.SECRET_KEY_JWT, function (err, decoded) {
                if (err) {
                    console.log(err);
                    res.statusCode = 401;
                    res.json({
                        error: 'not auth'
                    });
                } else {
                    req.body.userId = decoded.user.id;
                    req.body.userRole = decoded.user.role;
                    next();
                }
            });
        } else {
            res.statusCode = 401;
            res.json({
                error: 'unauthorized'
            });
        }
    },
    requireAdmin: function (req, res, next) {
        if (req.body.userRole === 'admin') {
            next();
        } else {
            res.statusCode = 403;
            res.json({
                error: 'forbidden'
            });
        }
    },
    requireTeacher: function (req, res, next) {
        if (req.body.userRole === 'teacher' || req.body.userRole === 'admin') {
            next();
        } else {
            res.statusCode = 403;
            res.json({
                error: 'forbidden'
            });
        }
    }
};
module.exports = authService;