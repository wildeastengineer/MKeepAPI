var dashboardController = require('../controllers/dashboard.js');

var dashboardRegisterRoutes = function (router, isAuthorized, sendError) {
    router.route('/dashboard')
        .get(isAuthorized, function (req, res) {
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
