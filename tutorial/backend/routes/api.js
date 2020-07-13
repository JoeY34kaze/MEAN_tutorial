var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');





router.get('/post', postController.getAll);
router.post('/post', postController.savePost);
router.delete('/post/:_id',postController.deletePost);

module.exports = router;
