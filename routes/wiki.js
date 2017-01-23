const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function (req, res, next) {

    Page.findAll({}).then(function(thepages){
        res.render('index', {pages: thepages});
    })
    .catch(function(err){
        next(err);
    });
});

router.get('/add', function (req, res) {
  res.render('addpage');
});

router.get('/:urlReq', function (req, res, next) {
  //SEQUELIZE METHOD TO FIND 1 ROW (ASYNC, so have return method in .then)
  Page.findOne({
  where: {
    urlTitle: req.params.urlReq
  }
  }).then(function(currentPage){
      //comes from belongsTo association
      currentPage.getAuthor()
      //add author to the currentPage object that you send to the wikipage so you can dynamically add author to template
      .then(function(author){
          //author is the whole author object, need to get just name
          currentPage.author = author.name;
          res.render('wikipage', {currentPage: currentPage});
      });
    })
    //if urlTitle doesnt exist we will handle the error
    .catch(function(err){
    next(err);
    });
});

router.post('/', function (req, res, next) {
  //returns promise, if not found, create in Users
  User.findOrCreate({
  where: {
    name: req.body.author,
    email: req.body.email
  }
})
//this .then will have values, and a boolean wheter it was created or not
.then(function (values) {
//values[0] is the user, values [1] is the boolean
  var user = values[0];

  return Page.create({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
  })
  .then(function(createdPage){
    //a method from the belongsTo, sets authorId of pages to id of User who wrote it
    return createdPage.setAuthor(user);
  });

  })
.then(function (createdPage) {
  res.redirect(createdPage.route);
})
//sending to error handling middleware
.catch(function(err){
    next(err);
});
});


module.exports = router;
