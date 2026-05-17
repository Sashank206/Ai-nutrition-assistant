const express = require('express');

const {
  getDietPlan,
} = require("../controllers/dietController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getDietPlan);

module.exports = router;