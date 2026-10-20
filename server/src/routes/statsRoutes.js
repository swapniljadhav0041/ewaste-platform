const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/platform', statsController.getPlatformStats);
router.get('/me', auth, statsController.getMyStats);
router.get('/admin', auth, role('ADMIN'), statsController.getAdminStats);

module.exports = router;
