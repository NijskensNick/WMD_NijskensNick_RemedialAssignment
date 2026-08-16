const express = require("express")
const router = express.Router();

// Controller
const controller = require("../controllers/usernames");

// Routes
router.get('/', controller.getUsernames)
router.post('/', controller.postUsername)
router.delete('/:id', controller.deleteUsername)

module.exports = router;