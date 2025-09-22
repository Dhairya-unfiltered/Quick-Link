const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.get('/:short', linkController.redirect);

module.exports = router;
