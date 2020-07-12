var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');




router.get('/post', postController.getAll);

module.exports = router;
