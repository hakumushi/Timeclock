'use strict';

module.exports = function(app) {
  var days = require('../controllers/daysController'),
  userHandlers = require('../controllers/usersController.js');

  // todoList Routes
  app.route('/days')
    .get(userHandlers.loginRequired, days.list_all_days)
    .post(userHandlers.loginRequired, days.create_a_day);

  app.route('/days/:dayId')
    .get(userHandlers.loginRequired, days.read_a_day)
    .put(userHandlers.loginRequired, days.update_a_day)
    .delete(userHandlers.loginRequired, days.delete_a_day);

  app.route('/get_a_day/:userId&:day')
    .get(userHandlers.loginRequired, days.read_a_day_by_user_id)

  app.route('/get_days_by_user/:userId')
    .get(userHandlers.loginRequired, days.get_days_by_user);

  app.route('/get_status_time/:userId&:start&:end')
    .get(userHandlers.loginRequired, days.get_status_time);

  app.route('/get_status_time_by_id/:userId')
    .get(userHandlers.loginRequired, days.get_status_time_by_id);
};