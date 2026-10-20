const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Offers
router.get('/', offerController.getOffers);
router.post('/', auth, role('ADMIN'), offerController.createOffer);
router.put('/:id', auth, role('ADMIN'), offerController.updateOffer);
router.post('/:id/redeem', auth, offerController.redeemOffer);

module.exports = router;
