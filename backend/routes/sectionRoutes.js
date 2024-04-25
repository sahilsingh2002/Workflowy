const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');
const {create,deleter,update} = require('../controllers/sectionController');
const router = Router({mergeParams:true}); 
router.use(authenticateUser);
router.post("/",create);
router.put("/",update);

router.delete('/',deleter);
module.exports = router