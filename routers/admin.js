/**
 * Created by 李锦-18810996718 on 2017/3/25.
 */
var express = require('express');
var router = express.Router();



var User = require('../models/User');
var Category = require('../models/Category');

router.use('/user',function(req,res,next){


    //res.send('ADMIN - user');
    if(!req.userInfo.isAdmin){
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才能进入后台页面');
        return;
    }
    next();
});

/*
首页
*/

router.get('/',function(req,res,next){
    //res.send('后台管理首页');
    res.render('admin/index',{
        userInfo: req.userInfo
    });
});

/*
用户管理
*/
router.get('/user',function(req,res){

    /*从数据库中读取所有的用户数据
    * limit（Number）:限制获取的条数
    *
    * skip(忽略数据的条数)
    *
    * 每页显示2条
    * 1: 1-2 skip:0
    * 2: 3-4 skip:2
    * */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil( count / limit );
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);

        var skip = (page - 1) * limit;

        /*1.升序
        * -1.降序
        * */
        User.find().sort({_id: -1}).limit(limit).skip(skip).then(function(users){
            //console.log(users);

            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users: users,

                page: page,
                count: count,
                limit: limit,
                pages: pages
            })
        });
    });

    /* 分类首页*/
    router.get('/category',function(req,res){
       /*res.render('admin/category_index',{
         userInfo: req.userInfo
         })*/
        var page = Number(req.query.page || 1);
        var limit = 2;
        var pages = 0;

        Category.count().then(function(count){
            //计算总页数
            pages = Math.ceil( count / limit );
            //取值不能超过pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);

            var skip = (page - 1) * limit;


            Category.find().limit(limit).skip(skip).then(function(categories){
                //console.log(users);

                res.render('admin/category_index',{
                    userInfo: req.userInfo,
                    categories: categories,

                    page: page,
                    count: count,
                    limit: limit,
                    pages: pages
                })
            });
        });

    });

/*分类的添加*/
    router.get('/category/add',function(req,res){
        res.render('admin/category_add',{
            userInfo: req.userInfo
        });
    });


    /*分类的保存*/
    router.post('/category/add',function(req,res){
        //console.log(req.body)
        var name = req.body.name || '';

        if(name == ''){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '名称不能为空'
            });
            return;
        }

        //数据库中是否已经存在同名的分类名称
        Category.findOne(function(){
            name: name
        }).then(function(rs){
            if(rs){
                //数据库中已经存在该分类了
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '分类已经存在了'
                });
                return Promise.reject();
            }else{
                //数据库中不存在该分类
                return new Category({
                    name: name
                }).save();
            }
        }).then(function(newCategory){
            res.render('admin/success',{
                userInfo: req.userInfo,
                message: '分类保存成功',
                url: '/admin/category'
            })
        })
    });

});

/*分类修改*/
router.get('/category/edit',function(req,res){
    //获取要修改的分类的信息,并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                messsage: '分类信息不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});

/*分类修改保存*/
router.post('/category/edit',function(req,res){
     //获取要修改的分类保存信息,并且用表单的形式表现出来
    var id = req.query.id || '';
    // 获取post提交过来的名称
    var name = req.query.name || '';

    //获取要修改的分类信息
    Category.findOne({
        id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                messsage: '分类信息不存在'
            });
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候
            if(name == category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }
            // 要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
           return Category.update({
                _id : id
            },{
                name: name
            })
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});

/*
分类删除
*/
router.get('/category/delete',function(req,res){
    //获取要删除分类的id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
                message: '删除成功',
                url: '/admin/category'
        })
    });
});

/*内容首页*/
router.get('/content',function(req,res){

    res.render('admin/content_index',{
        userInfo: req.userInfo
    })
});

/*内容添加*/
router.get('/content/add',function(req,res){

    res.render('admin/content_add',{
        userInfo: req.userInfo
    })
});

module.exports = router;