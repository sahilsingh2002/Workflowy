const {authenticateUser} = require('../middlewares/auth');
const {authing} = require('../controllers/authController');
const {Router} = require('express');
const protRouter = Router();
protRouter.post('/auth',authenticateUser,authing);
module.exports = protRouter;