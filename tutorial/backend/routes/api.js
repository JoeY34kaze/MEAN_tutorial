var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');

/* GET home page. */
router.get('/post', postController.getAll);

module.exports = router;
