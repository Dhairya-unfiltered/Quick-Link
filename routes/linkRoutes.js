const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const linkController = require('../controllers/linkController');

router.post('/', protect, linkController.createLink);
router.get('/:id', protect, linkController.getLinkView);
router.put('/:id', protect, express.json(), linkController.updateLink);
router.delete('/:id', protect, linkController.deleteLink);

module.exports = router;
