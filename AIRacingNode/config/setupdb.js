// Setup the database with:
// -- Basic scripts.
// -- Default admin account

module.exports = function(db) {
    setupScripts(db);
    setupAdmin(db);
};

function setupScripts(db) {
    var scriptCollection = db.get('scriptcollection');

    scriptCollection.count({}, function(err, count) {
        if (count === 0) {
            var glob = require('glob');
            glob('scripts/*', function (err, scriptfiles) {
                var scripts = [];

                scriptfiles.forEach(function (scriptfile) {
                    scripts.push(require('../' + scriptfile));
                });

                scriptCollection.insert(scripts);
            });
        }
    });
}

function setupAdmin(db) {
    var users = db.get('users');

    users.findOne({ 'local.email' : 'administr@tor'}, function(err, admin) {
        if (!admin) {
            var User = require('../models/user');
            var newAdmin = new User();

            newAdmin.local.email    = 'administr@tor';
            newAdmin.local.password = newAdmin.generateHash('lollipop');
            newAdmin.local.admin = true;
            newAdmin.save();
        }
    });
}