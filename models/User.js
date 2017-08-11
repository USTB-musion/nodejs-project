/**
 * Created by 李锦-18810996718 on 2017/3/25.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);