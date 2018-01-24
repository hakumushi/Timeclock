'use strict';

var Promise = require('promise');
var moment = require('moment');
var mongoose = require('mongoose'),
Day = mongoose.model('Days'),
User = mongoose.model('Users');

exports.list_all_days = function(req, res) {
  Day.find({}, function(err, days) {
    if (err)
      res.send(err);
    res.json(days);
  });
};

exports.create_a_day = function(req, res) {
  var new_day = new Day(req.body);
  new_day.save(function(err, day) {
    if (err)
      res.send(err);
    res.json(day);
  });
};

exports.read_a_day_by_user_id = function(req, res) {
  Day.findOne({ user_id: req.params.userId, day: req.params.day }, function(err, day) {
    if (err)
      res.send(err);
    res.json(day);
  });
};

exports.read_a_day = function(req, res) {
  Day.findById(req.params.dayId, function(err, day) {
    if (err)
      res.send(err);
    res.json(day);
  });
};

exports.update_a_day = function(req, res) {
  Day.findOneAndUpdate({_id: req.params.dayId}, req.body, {new: true}, function(err, day) {
    if (err)
      res.send(err);
    res.json(day);
  });
};

exports.delete_a_day = function(req, res) {
  Day.remove({
    _id: req.params.dayId
  }, function(err, day) {
    if (err)
      res.send(err);
    res.json({ message: 'day successfully deleted' });
  });
};

exports.get_days_by_user = function(req, res){
  Day.find({user_id:req.params.userId}, function(err, days) {
    if (err)
      res.send(err);
    res.json(days);
  });
};

exports.get_status_time = function(req, res){
  Day.find({user_id:req.params.userId, day:{$gte: req.params.start, 
            $lt: req.params.end}}, function(err, days) {
    if (err)
      res.send(err);
    
    var number_of_hours = 0;
    Promise.resolve(get_hours_per_day(req.params.userId)).then(function(hours_per_day){
          Promise.resolve(get_amount_of_days(days, hours_per_day)).then(function(amount){
            number_of_hours = hours_per_day * days.length*60
            var minutes = (amount-number_of_hours);
            if (minutes>0){
              res.json(get_time_from_minutes(minutes).toString());
            }
            else if(minutes===0){
              res.json("00:00");
            }
            else{
              res.json("-"+get_time_from_minutes(minutes*-1).toString());
            }
          }); 
      });  
  });
};

exports.get_status_time_by_id = function(req, res){
  Day.find({user_id:req.params.userId}, function(err, days) {
    if (err)
      res.send(err);
    var number_of_hours = 0;
    Promise.resolve(get_hours_per_day(req.params.userId)).then(function(hours_per_day){
        Promise.resolve(get_amount_of_days(days, hours_per_day)).then(function(amount){
          number_of_hours = hours_per_day * days.length*60
          var minutes = (amount-number_of_hours);
          if (minutes>0){
            res.json(get_time_from_minutes(minutes).toString());
          }
          else if(minutes===0){
            res.json("00:00");
          }
          else{
            res.json("-"+get_time_from_minutes(minutes*-1).toString());
          }
        }); 
    });  
  });
};

var get_hours_per_day = function(user_id){
  return new Promise(function(resolve, reject) {
    User.findById(user_id, function (err, user) {
      if (err) reject(err);
      resolve(user.hours_per_day);
    });
  });
};

var get_amount_of_days = function(days, hours_per_day){
  return new Promise(function(resolve,reject){
    var amount = 0;
    days.forEach(function get_inputs_of_a_day(day) {
        if(day.status === 1){
          day.inputs.forEach(function get_input_item(item) {
              if(item.type===0){
                  var out = String(item.out).split(':');
                  var outMinutes = parseInt(out[0])*60 + parseInt(out[1]);
                  var enter = String(item.enter).split(':');
                  var enterMinutes = parseInt(enter[0])*60 + parseInt(enter[1]);
                  amount+=outMinutes-enterMinutes;
              }
        });
       }
       else if(day.status === 0 || day.status === 3){
        amount+=hours_per_day*60;       
      }
    });
    resolve(amount);
  });
};

var get_time_from_minutes = function(mins) {

  var hours = mins / 60 | 0,
    minutes = mins % 60 | 0;
  if(hours < 10){
    hours = '0'+hours; 
  }
  if(minutes < 10){
    minutes = '0'+minutes; 
  }
  return hours+':'+minutes;//moment.utc().hours(hours).minutes(minutes).format("hh:mm A");
};