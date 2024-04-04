const {Router} = require('express');
const {post_signup} = require('../controllers/authController')
const router = Router(); 

router.get('/signup',()=>{});
router.post('/signup',post_signup);
router.get('/login',()=>{});
router.post('/login',()=>{});
module.exports = router;