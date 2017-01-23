const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function (req, res, next) {
    var pagesArr = [];
    Page.findAll().then(function(pages){
        for (var i = 0; i < pages.length;i++){
            pagesArr.push(pages[i].get());
        }
        console.log(pagesArr);
        res.render('index', {pages: pagesArr});
    });
});

router.get('/add', function (req, res) {
  res.render('addpage');
});

router.get('/:urlReq', function (req, res) {
  //SEQUELIZE METHOD TO FIND 1 ROW (ASYNC, so have return method in .then)
  Page.findOne({
  where: {
    urlTitle: req.params.urlReq
  }
  }).then(function(currentPage){
      console.log(currentPage.dataValues);
      res.render('wikipage', {currentPage: currentPage.dataValues});
  });
});

router.post('/', function (req, res, next) {
  User.findOrCreate({
  where: {
    name: req.body.author,
    email: req.body.email
  }
})
.then(function (values) {

  var user = values[0];

  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  });

})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);
});


module.exports = router;
