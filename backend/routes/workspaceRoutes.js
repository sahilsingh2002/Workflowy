const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');
const { addWorkspace, getWorkspaces, getOnepage, archive } = require('../controllers/workspaceController');
const router = Router(); 
router.use(authenticateUser);
router.post("/add",addWorkspace);
router.get("/getworkspaces",getWorkspaces);
router.get("/getPage",getOnepage);
router.post("/archive",archive);

module.exports = router