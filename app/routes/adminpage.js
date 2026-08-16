const express = require("express");
const router = express.Router();

// Controller
const controller = require("../controllers/adminpage");

// Routes
router.get('/', controller.getAdminpage);

module.exports = router;