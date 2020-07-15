var express = require('express');
const multer = require("multer");
var router = express.Router();
const postController = require('../controllers/post');
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});





router.post("/post",multer({ storage: storage }).single("image"),postController.savePost);
router.put("/post/:_id",multer({ storage: storage }).single("image"), postController.updatePost);//put =zbris prejsnjega in nared novga. /patch = bi biu pa samo updejtej brez brisanja celga objekta

router.get('/post',postController.getAll);
router.delete('/post/:_id',postController.deletePost);
router.get("/post/:_id", postController.getPost);
module.exports = router;
