var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const postController = require('../controllers/post');





router.get('/post', postController.getAll);
router.post('/post', postController.savePost);

module.exports = router;
