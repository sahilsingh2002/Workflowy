const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');

const {createTask,deleter,update,updatePosition, uploadImage} = require('../controllers/taskController');
const {initializeApp} = require("firebase/app");
const multer = require('multer');
const firebaseConfig = require ('../config/firebase.config');
const router = Router({mergeParams:true}); 
initializeApp(firebaseConfig);

router.use(authenticateUser);
const upload = multer({storage:multer.memoryStorage()});


router.post('/',createTask);
router.delete('/:taskId',deleter);
router.put('/update-position',updatePosition);
router.put('/:taskId',update);
router.post('/upload_image',upload.single("filename"),uploadImage);


module.exports = router;
