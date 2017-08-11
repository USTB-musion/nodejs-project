/**
 * Created by 李锦-18810996718 on 2017/3/25.
 */
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');

router.get('/',function(req,res,next){

    //读取所有的分类信息
    Category.find().then(function(categories){
        console.log(categories);
        res.render('main/index',{
            userInfo : req.userInfo
        });
    });
    });
    //console.log(req.userInfo);
    //res.send('首页');
    //渲染模板


module.exports = router;