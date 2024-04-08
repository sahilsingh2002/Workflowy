const {Router} = require('express');
const {post_signup,get_signup, post_login} = require('../controllers/authController')
const router = Router(); 

router.get('/signup',get_signup);
router.post('/signup',post_signup);
router.get('/login',()=>{});
router.post('/login',post_login);
module.exports = router;