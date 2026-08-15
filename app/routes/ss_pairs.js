const express = require("express")
const router = express.Router();

// Controller
const controller = require('../controllers/ss_pairs');

// Routes
router.get('/', controller.getStandingStillPairs);
router.post('/', controller.postStandingStillPair);
router.get('/:id', controller.getStandingStillPair)
router.put('/:id', controller.updateStandingStillPair);
router.delete('/:id', controller.deleteStandingStillPair)

module.exports = router;