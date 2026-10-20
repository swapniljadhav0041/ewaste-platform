const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', categoryController.getCategories);
router.post('/', auth, role('ADMIN'), categoryController.createCategory);
router.put('/:id', auth, role('ADMIN'), categoryController.updateCategory);

module.exports = router;
