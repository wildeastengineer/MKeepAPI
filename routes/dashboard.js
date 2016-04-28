/// Controllers
var dashboardController = require('../controllers/dashboard.js');

var dashboardRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/dashboard')
        .get(authenticate, function (req, res) {
            dashboardController.getData(
                function (err, dashboardData) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(dashboardData);
                }
            );
        })
};

module.exports = {
    register: dashboardRegisterRoutes
};
