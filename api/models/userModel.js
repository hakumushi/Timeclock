'use strict';

var mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the user'
  },
  email: {
    type: String,
    required: 'Kindly enter the email of the user'
  },
  password: {
    type: String,
    required: 'Kindly enter the password of the user'
  },
  hours_per_day: {
    type: Number,
    required: 'Kindly enter the hours per day of the user'
  },
  fixed_schedule:{
    type: Array
  },
  lunch_fixed_schedule:{
    type: Array
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', UserSchema);