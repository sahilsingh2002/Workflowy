const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');
const { addWorkspace, getWorkspaces, getOnepage, updatePosition, update, getFavorite, updateFavPos, removal } = require('../controllers/workspaceController');
const router = Router(); 
router.use(authenticateUser);
router.post("/add",addWorkspace);
router.get("/getworkspaces",getWorkspaces);
router.get("/getPage",getOnepage);
router.put("/update",update);
router.patch("/",updatePosition)
router.get("/favourites",getFavorite);
router.patch("/favourites",updateFavPos);
router.delete('/',removal);
module.exports = router