const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');
const {createTask,deleter,update,updatePosition} = require('../controllers/taskController');
const router = Router({mergeParams:true}); 
router.use(authenticateUser);


router.post('/',createTask);
router.delete('/:taskId',deleter);
router.put('/update-position',updatePosition);
router.put('/:taskId',update);
