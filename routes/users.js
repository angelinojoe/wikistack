const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

router.get('/', function (req, res, next){
    User.findAll({}).then(function(users){
        res.render('users', {users: users});
    }).catch(function(err){
        next(err);
    });
});

router.get('/:id', function (req, res, next){
    //uses a promise.all after user and all their pages are found
    var userPromise = User.findById(req.params.id);
    var pagesPromise = Page.find({
        where: {
            authorId: req.params.id
        }
    });
    //sends user and pages to res.render
    Promise.all([userPromise, pagesPromise])
    .then(function(values){
        var user = values[0];
        var pages = values[1];
        //WHY WONT THE FOR IN LOOP WORK IN SINGLEUSER.HTML??
        res.render('singleUser', {user: user, pages: pages});
    }).catch(next);
});

module.exports = router;
