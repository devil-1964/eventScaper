const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/events', apiController.getEvents);
router.post('/email', apiController.submitEmail);

module.exports = router;
