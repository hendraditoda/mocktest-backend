const userController = require('../controllers/user.controller');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const router = require('express').Router();

router.post('/logout', userController.logout);

module.exports = router;
