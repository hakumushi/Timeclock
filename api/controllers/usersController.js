'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt'),
jsonwebtoken = require("jsonwebtoken"),
User = mongoose.model('Users');

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.create_a_user = function(req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      res.cookie('Token', jwt.sign({ email: user.email, name: user.name, _id: user._id}, 'RESTFULAPIs') ).send({_id: user._id, name:user.name, email:user.email, hours_per_day: user.hours_per_day});
    }
  });
};

exports.login = function(req, res){
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        res.cookie('Token', jwt.sign({ email: user.email, name: user.name, _id: user._id}, 'RESTFULAPIs') ).send({_id: user._id, name:user.name, email:user.email, hours_per_day: user.hours_per_day});
      }
    }
  });
};

exports.logout = function(req, res){
  res.redirect('/');
};

exports.loginRequired = function(req, res, next){
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

exports.read_a_user = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.getUserByToken = function(req, res) {
  jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
    User.findById(decode._id, {password:0, __v:0}, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  });
};

exports.update_a_user = function(req, res) {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.delete_a_user = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'user successfully deleted' });
  });
};