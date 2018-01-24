'use strict';

module.exports = function(app) {
  var users = require('../controllers/usersController');

  app.route('/users')
    .get(users.loginRequired, users.list_all_users)

  app.route('/register')
    .post(users.create_a_user);

  app.route('/login')
    .post(users.login)

  app.route('/logout')
    .get(users.logout)

  app.route('/users/:userId')
    .get(users.loginRequired, users.read_a_user)
    .put(users.loginRequired, users.update_a_user)
    .delete(users.loginRequired, users.delete_a_user);

  app.route('/getUserByToken')
    .get(users.loginRequired, users.getUserByToken)
};