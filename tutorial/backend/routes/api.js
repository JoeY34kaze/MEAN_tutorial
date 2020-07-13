var express = require('express');
var router = express.Router();
const postController = require('../controllers/post');

router.get('/post', postController.getAll);
router.post('/post', postController.savePost);
router.delete('/post/:_id',postController.deletePost);
router.put("/post/:_id", postController.updatePost);//put =zbris prejsnjega in nared novga. /patch = bi biu pa samo updejtej brez brisanja celga objekta
router.get("/post/:_id", postController.getPost);
module.exports = router;
