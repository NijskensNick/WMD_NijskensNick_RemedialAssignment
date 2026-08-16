const express = require("express")
const router = express.Router();

// Controller
const controller = require("../controllers/pt_pairs");

// Routes
router.get('/', controller.getPassingThroughPairs);
router.post('/', controller.postPassingThroughPair);
router.get('/:id', controller.getPassingThroughPair);
router.put('/:id', controller.updatePassingThroughPair);
router.delete('/:id', controller.deletePassingThroughPair);

module.exports = router;