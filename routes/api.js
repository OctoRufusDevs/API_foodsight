const express = require('express');
const router = express.Router();

const restaurantRouter = require('./api/RestaurantRoutes');

router.use("/restaurant", restaurantRouter);

module.exports = router;