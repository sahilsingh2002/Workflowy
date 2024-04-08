const {Router} = require('express');
const {post_signup, post_login} = require('../controllers/authController')
const router = Router(); 
router.post('/signup',post_signup);
router.post('/login',post_login);
module.exports = router;