const bodyParser = require('body-parser');
const userControllerAPI = require('../../controllers/api/user.api.controller');
const { verifyToken } = require('../../middleware/verifyToken');

const jsonParser = bodyParser.json();
const router = require('express').Router();

router.get('/:id', userControllerAPI.userData);
router.get('/session', userControllerAPI.getSession);
router.post('/login', jsonParser, userControllerAPI.login);
router.post('/register', jsonParser, userControllerAPI.register);
router.get('/users', verifyToken, userControllerAPI.getUser);
router.post('/logout', verifyToken, userControllerAPI.logout);
router.put('/edit/:id', userControllerAPI.updateProfile);
// router.post('/forgot-password', userControllerAPI.forgotPassword);
router.post('/reset-password', userControllerAPI.resetPassword);

module.exports = router;
