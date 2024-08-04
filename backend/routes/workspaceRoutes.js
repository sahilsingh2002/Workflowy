const {Router} = require('express');
const {initializeApp} = require("firebase/app");
const multer = require('multer');
const firebaseConfig = require ('../config/firebase.config');
const { addWorkspace, getWorkspaces, getOnepage, updatePosition, update, getFavorite, updateFavPos, removal, searchUser, updateUser,uploadImage } = require('../controllers/workspaceController');
const {authenticateUser} = require('../middlewares/auth');
const router = Router({mergeParams:true}); 
initializeApp(firebaseConfig);
const upload = multer({storage:multer.memoryStorage()});
router.use(authenticateUser);
router.post("/add",addWorkspace);
router.get("/getworkspaces",getWorkspaces);
router.get("/getPage",getOnepage);
router.put("/update",update);
router.patch("/",updatePosition)
router.get("/favourites",getFavorite);
router.patch("/favourites",updateFavPos);
router.delete('/',removal);
router.post('/finduser',searchUser);
router.post('/filluser',updateUser);
router.post('/upload_image',upload.single("filename"),uploadImage);
module.exports = router