const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Citizen routes
router.post('/', auth, submissionController.createSubmission);
router.get('/mine', auth, submissionController.getMySubmissions);
router.patch('/:id/cancel', auth, submissionController.cancelSubmission);

// Collector / Admin management
router.get('/', auth, role('COLLECTOR', 'ADMIN'), submissionController.getAllSubmissions);
router.patch('/:id/schedule', auth, role('COLLECTOR', 'ADMIN'), submissionController.scheduleSubmission);
router.patch('/:id/collect', auth, role('COLLECTOR', 'ADMIN'), submissionController.collectSubmission);
router.post('/:id/verify', auth, role('COLLECTOR', 'ADMIN'), submissionController.verifySubmission);
router.post('/:id/reject', auth, role('COLLECTOR', 'ADMIN'), submissionController.rejectSubmission);

// Single submission details
router.get('/:id', auth, submissionController.getSubmissionById);

module.exports = router;
