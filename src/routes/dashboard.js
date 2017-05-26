/// Controllers
const dashboardController = require('../controllers/dashboard.js');

/**
 * Dashboard routes.
 * @class routes/Dashboard
 */
let dashboardRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/dashboard')
        /**
         * Get dashboard info
         *
         * @function
         * @name GET: /dashboard
         * @memberof routes/Dashboard
         *
         * @returns {Object} dashboardData
         */
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
