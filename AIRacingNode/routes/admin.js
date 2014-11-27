var express = require('express');
var router = express.Router();

/* GET user profile. */
router.get('/', [isLoggedIn, isAdmin], function(req, res) {
    var collection = req.db.get('users');

    collection.find({}, {sort : { email : 1 }}, function(e, docs) {
        res.render('admin', {
            "users" : docs
        });
    });
});

function isLoggedIn(req, res, next) {

    req.session.redirect = '/admin';

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.user && req.user.local.admin)
        return next();

    res.send(401, 'Unauthorized');
}

module.exports = router;
