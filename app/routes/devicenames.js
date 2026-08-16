const express = require("express")
const router = express.Router();

// Controller
const controller = require("../controllers/devicenames");

// Routes
router.get('/', controller.getDeviceNames)
router.post('/', controller.postDeviceName)
router.delete('/:id', controller.deleteDeviceName)

module.exports = router;