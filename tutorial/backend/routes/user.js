//login and sigup
var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');



///api/user/signup
router.post("/signup", userController.createNewUser)
router.post("/login", userController.login)








module.exports = router;
