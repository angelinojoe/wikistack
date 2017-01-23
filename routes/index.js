const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('/wiki/');
});

router.get('/add', function (req, res) {
  res.send('/wiki/add');
});

router.post('/', function (req, res) {
  res.send('/wiki/ post');
});
module.exports = router;
