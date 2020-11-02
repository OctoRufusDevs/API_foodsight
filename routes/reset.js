const express = require('express');
const router = express.Router();
const resetRoutes = require('./reset/ResetRoutes');

router.use("/", resetRoutes);

module.exports = router;