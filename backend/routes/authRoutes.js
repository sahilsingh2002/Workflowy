const {Router} = require('express');
const {post_signup, post_login,isUser} = require('../controllers/authController')
const {authenticateUser} = require('../middlewares/auth');
const {authing} = require('../controllers/authController');
const router = Router(); 
router.post('/signup',post_signup);
router.post('/login',post_login);
router.post('/username',isUser);
router.post('/authenticate',authenticateUser,authing);
module.exports = router;