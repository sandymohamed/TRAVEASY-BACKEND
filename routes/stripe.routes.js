const express = require('express');
const { getStripe, postStripe } = require('../controllers/stripe.controller');
const router = express.Router();

router.get('/', getStripe)
router.post('/pay', postStripe)

module.exports = { stripeRoutes: router };
