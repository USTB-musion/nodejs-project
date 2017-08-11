/**
 * Created by 李锦-18810996718 on 2017/3/29.
 */
var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesSchema);