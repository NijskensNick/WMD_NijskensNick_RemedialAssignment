const express = require("express")
const router = express.Router();

// Controller
const controller = require("../controllers/sessions");

// Routes
router.get('/', controller.getSessions)
router.post('/', controller.postSession)
router.get('/:id', controller.getSession)
router.put('/:id', controller.updateSession)
router.delete('/:id', controller.deleteSession)

module.exports = router;