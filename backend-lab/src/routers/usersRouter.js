const express = require('express');
const router = express.Router();
const objController = require('../controllers/usersController');

router.post('/', objController.doRegister);


module.exports = router;