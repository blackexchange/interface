const express = require('express');
const router = express.Router();
const objController = require('../controllers/rawController');

router.post('/', objController.createOne);


module.exports = router;