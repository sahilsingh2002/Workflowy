const {Router} = require('express');
const {authenticateUser} = require('../middlewares/auth');
const { addWorkspace, getWorkspaces, getOnepage, archive } = require('../controllers/workspaceController');
const router = Router(); 
router.post("/add",addWorkspace);
router.post("/getworkspaces",getWorkspaces);
router.post("/getPage",getOnepage);
router.post("/archive",archive);

module.exports = router